'use client';

import { useEditor, EditorContent, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TiptapImage from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { DOMParser as PMDOMParser } from '@tiptap/pm/model';
import type { EditorView } from '@tiptap/pm/view';
import { marked } from 'marked';
import { useEffect, useRef, useState, useTransition, type ChangeEvent } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createClient as createBrowserClient } from '@/lib/supabase/client';
import { createArticleShell, updateArticle } from '@/src/features/admin/actions/article.actions';
import type { ArticleEntity, ArticleFormData, NewsCategory } from '@/src/features/news/types/article.types';
import styles from './ArticleEditor.module.css';

interface Props {
  article?: ArticleEntity;
}

function generateId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

function pasteMarkdown(view: EditorView, event: ClipboardEvent): boolean {
  const clipboard = event.clipboardData;
  if (!clipboard) return false;
  if (clipboard.getData('text/html')) return false;
  const plain = clipboard.getData('text/plain');
  if (!plain) return false;

  const html = marked.parse(plain, { async: false, gfm: true, breaks: false }) as string;

  const dom = document.createElement('div');
  dom.innerHTML = html;
  const slice = PMDOMParser.fromSchema(view.state.schema).parseSlice(dom);
  view.dispatch(view.state.tr.replaceSelection(slice).scrollIntoView());
  event.preventDefault();
  return true;
}

export default function ArticleEditor({ article }: Props) {
  const isEdit = !!article;
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const coverFileInputRef = useRef<HTMLInputElement | null>(null);
  const editorRef = useRef<Editor | null>(null);
  const [pendingImages, setPendingImages] = useState<Record<string, File>>({});
  // 대표 이미지: 기존 저장된 URL 또는 새로 선택한 파일
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(article?.cover_img_url ?? null);
  const [pendingCoverFile, setPendingCoverFile] = useState<File | null>(null);
  const [pendingCoverPreview, setPendingCoverPreview] = useState<string | null>(null);

  const [title, setTitle] = useState(article?.title ?? '');
  const [titleEn, setTitleEn] = useState(article?.title_en ?? '');
  const [titleJa, setTitleJa] = useState(article?.title_ja ?? '');
  const [activeLocale, setActiveLocale] = useState<'ko' | 'en' | 'ja'>('ko');
  const [isTranslating, setIsTranslating] = useState(false);
  const [translateError, setTranslateError] = useState<string | null>(null);
  const [category, setCategory] = useState<NewsCategory>(
    (article?.category as NewsCategory) ?? 'company'
  );

  const ImageWithTemp = TiptapImage.extend({
    addAttributes() {
      return {
        ...this.parent?.(),
        'data-temp-id': { default: null },
      };
    },
  });

  const handleImageUpload = async (file: File) => {
    const activeEditor = editorRef.current;
    if (!activeEditor) return;
    setUploadError(null);

    const tempId = generateId();
    const tempUrl = URL.createObjectURL(file);
    setPendingImages((prev) => ({ ...prev, [tempId]: file }));

    activeEditor
      .chain()
      .focus()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .setImage({ src: tempUrl, alt: file.name, 'data-temp-id': tempId } as any)
      .run();
  };

  const sharedExtensions = [
    StarterKit,
    ImageWithTemp,
    Link.configure({ openOnClick: false }),
  ];

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      ...sharedExtensions,
      Placeholder.configure({ placeholder: '본문을 작성하세요...' }),
    ],
    content: article?.content ?? '',
    onCreate: ({ editor }) => {
      editorRef.current = editor;
    },
    onDestroy: () => {
      editorRef.current = null;
    },
    editorProps: {
      attributes: { class: styles.editorContent },
      handlePaste: (view, event) => {
        const items = Array.from(event.clipboardData?.items ?? []);
        const imageItem = items.find((item) => item.type.startsWith('image/'));
        if (imageItem) {
          const file = imageItem.getAsFile();
          if (file) {
            event.preventDefault();
            void handleImageUpload(file);
            return true;
          }
        }
        return pasteMarkdown(view, event);
      },
      handleDrop: (_view, event) => {
        const files = Array.from(event.dataTransfer?.files ?? []);
        const imageFile = files.find((file) => file.type.startsWith('image/'));
        if (!imageFile) return false;
        event.preventDefault();
        void handleImageUpload(imageFile);
        return true;
      },
    },
  });

  const editorEn = useEditor({
    immediatelyRender: false,
    extensions: [
      ...sharedExtensions,
      Placeholder.configure({ placeholder: 'Enter article content in English...' }),
    ],
    content: article?.content_en ?? '',
    editorProps: {
      attributes: { class: styles.editorContent },
      handlePaste: (view, event) => pasteMarkdown(view, event),
    },
  });

  const editorJa = useEditor({
    immediatelyRender: false,
    extensions: [
      ...sharedExtensions,
      Placeholder.configure({ placeholder: '日本語で記事の内容を入力してください...' }),
    ],
    content: article?.content_ja ?? '',
    editorProps: {
      attributes: { class: styles.editorContent },
      handlePaste: (view, event) => pasteMarkdown(view, event),
    },
  });

  // 대표 이미지 파일 선택 핸들러
  const handleCoverFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (pendingCoverPreview) URL.revokeObjectURL(pendingCoverPreview);
    const preview = URL.createObjectURL(file);
    setPendingCoverFile(file);
    setPendingCoverPreview(preview);
    setCoverImageUrl(null);
    event.target.value = '';
  };

  const handleCoverClear = () => {
    if (pendingCoverPreview) URL.revokeObjectURL(pendingCoverPreview);
    setPendingCoverFile(null);
    setPendingCoverPreview(null);
    setCoverImageUrl(null);
  };

  const handleFileInputChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    await handleImageUpload(file);
    event.target.value = '';
  };

  const handleTranslate = async () => {
    const content = editor?.getHTML() ?? '';
    if (!title.trim()) { setTranslateError('한국어 제목을 입력해주세요.'); return; }
    if (!content || content === '<p></p>') { setTranslateError('한국어 본문을 작성해주세요.'); return; }

    const hasExistingEn = titleEn.trim() || (editorEn?.getHTML() && editorEn.getHTML() !== '<p></p>');
    const hasExistingJa = titleJa.trim() || (editorJa?.getHTML() && editorJa.getHTML() !== '<p></p>');
    if (hasExistingEn || hasExistingJa) {
      const ok = window.confirm('영어/일본어에 이미 작성된 내용이 있으면 덮어씁니다. 계속하시겠습니까?');
      if (!ok) return;
    }

    setTranslateError(null);
    setIsTranslating(true);

    try {
      const response = await fetch('/api/admin/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      });

      if (!response.ok) {
        const detail = await response.json().catch(() => null);
        throw new Error(detail?.message ?? '번역 요청이 실패했습니다.');
      }

      const { titleEn: translatedTitleEn, titleJa: translatedTitleJa, contentEn, contentJa } =
        await response.json();

      setTitleEn(translatedTitleEn);
      setTitleJa(translatedTitleJa);
      editorEn?.commands.setContent(contentEn);
      editorJa?.commands.setContent(contentJa);
    } catch (error) {
      const message = error instanceof Error ? error.message : '번역 중 오류가 발생했습니다.';
      setTranslateError(message);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSubmit = () => {
    const content = editor?.getHTML() ?? '';
    if (!title.trim()) { setServerError('제목을 입력해주세요.'); return; }
    if (!content || content === '<p></p>') { setServerError('본문을 작성해주세요.'); return; }

    setServerError(null);
    setSaveSuccess(false);

    startTransition(async () => {
      let createdArticleId: string | null = null;
      try {
        setIsUploading(true);
        setUploadError(null);

        const supabase = createBrowserClient();
        let articleId = article?.id;

        if (!articleId) {
          const created = await createArticleShell(title, category);
          if (created && 'error' in created) {
            setServerError(created.error);
            return;
          }
          articleId = created.id;
          createdArticleId = created.id;
        }

        let nextContent = content;
        let resolvedCoverUrl: string | null = coverImageUrl;

        // 새로 선택한 대표 이미지 파일을 Supabase에 업로드
        if (pendingCoverFile) {
          const objectKey = generateId();
          const ext = pendingCoverFile.name.split('.').pop() || 'png';
          const filePath = `articles/${articleId}/cover_${objectKey}.${ext}`;

          const { error: coverUploadError } = await supabase
            .storage
            .from('article-images')
            .upload(filePath, pendingCoverFile, { upsert: false, contentType: pendingCoverFile.type });

          if (coverUploadError) throw coverUploadError;

          const { data: coverPublicData } = supabase
            .storage
            .from('article-images')
            .getPublicUrl(filePath);

          resolvedCoverUrl = coverPublicData?.publicUrl ?? null;
        }

        const tempImages = Object.keys(pendingImages);

        if (tempImages.length > 0) {
          const parser = new DOMParser();
          const doc = parser.parseFromString(content, 'text/html');
          const imgNodes = Array.from(doc.querySelectorAll('img[data-temp-id]'));

          for (const img of imgNodes) {
            const tempId = img.getAttribute('data-temp-id');
            if (!tempId) continue;
            const file = pendingImages[tempId];
            if (!file) throw new Error('업로드할 이미지 파일을 찾을 수 없습니다.');

            const objectKey = generateId();
            const ext = file.name.split('.').pop() || 'png';
            const filePath = `articles/${articleId}/${objectKey}.${ext}`;

            const { error: uploadError } = await supabase
              .storage
              .from('article-images')
              .upload(filePath, file, { upsert: false, contentType: file.type });

            if (uploadError) throw uploadError;

            const { data: publicData } = supabase
              .storage
              .from('article-images')
              .getPublicUrl(filePath);

            const imageUrl = publicData?.publicUrl;
            if (!imageUrl) throw new Error('이미지 URL을 가져오지 못했습니다.');

            const dimensions = await new Promise<{ width: number; height: number }>((resolve, reject) => {
              const imgEl = new window.Image();
              imgEl.onload = () => {
                URL.revokeObjectURL(imgEl.src);
                resolve({ width: imgEl.width, height: imgEl.height });
              };
              imgEl.onerror = () => reject(new Error('이미지 정보를 읽지 못했습니다.'));
              imgEl.src = URL.createObjectURL(file);
            });

            const { error: insertError } = await supabase
              .from('article_images')
              .insert({
                article_id: articleId,
                image_url: imageUrl,
                alt: file.name,
                width: dimensions.width,
                height: dimensions.height,
                caption: null,
                sort_order: 0,
              });

            if (insertError) throw insertError;

            img.setAttribute('src', imageUrl);
            img.removeAttribute('data-temp-id');
          }

          nextContent = doc.body.innerHTML;
        }

        const formData: ArticleFormData = {
          title,
          title_en: titleEn,
          title_ja: titleJa,
          content: nextContent,
          content_en: editorEn?.getHTML() ?? '',
          content_ja: editorJa?.getHTML() ?? '',
          cover_img_url: resolvedCoverUrl,
          category,
        };

        const result = await updateArticle(articleId, formData);

        if (result && 'error' in result) {
          setServerError(result.error);
          return;
        }

        if (editor && nextContent !== content) {
          editor.commands.setContent(nextContent);
        }

        setPendingImages({});
        if (pendingCoverPreview) URL.revokeObjectURL(pendingCoverPreview);
        setPendingCoverFile(null);
        setPendingCoverPreview(null);
        setCoverImageUrl(resolvedCoverUrl);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);

        if (!isEdit) {
          router.replace(`/admin/articles/${articleId}/edit`);
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : '저장에 실패했습니다.';
        setUploadError(message);

        if (!isEdit && createdArticleId) {
          await createBrowserClient()
            .from('articles')
            .delete()
            .eq('id', createdArticleId);
        }
      } finally {
        setIsUploading(false);
      }
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <div className={styles.meta}>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as NewsCategory)}
            className={styles.select}
          >
            <option value="company">회사소식</option>
            <option value="construction">건설소식</option>
            <option value="technology">기술소식</option>
          </select>
        </div>
        <div className={styles.actions}>
          {serverError && <span className={styles.errorMsg}>{serverError}</span>}
          {translateError && <span className={styles.errorMsg}>{translateError}</span>}
          {saveSuccess && <span className={styles.successMsg}>저장됨 ✓</span>}
          <button
            type="button"
            onClick={() => handleTranslate()}
            disabled={isTranslating || isPending || isUploading}
            className={styles.translateBtn}
          >
            {isTranslating ? '번역 중...' : '🌐 자동번역'}
          </button>
          <button
            type="button"
            onClick={() => handleSubmit()}
            disabled={isPending || isUploading || isTranslating}
            className={styles.publishBtn}
          >
            {isPending || isUploading ? '저장 중...' : '저장'}
          </button>
        </div>
      </div>

      <div className={styles.localeTabs}>
        <button type="button" className={`${styles.localeTab} ${activeLocale === 'ko' ? styles.localeTabActive : ''}`} onClick={() => setActiveLocale('ko')}>KR</button>
        <span className={styles.localeDivider}>|</span>
        <button type="button" className={`${styles.localeTab} ${activeLocale === 'en' ? styles.localeTabActive : ''}`} onClick={() => {
          if (editorEn && editor) {
            const enHtml = editorEn.getHTML();
            if (!enHtml || enHtml === '<p></p>') {
              editorEn.commands.setContent(editor.getHTML());
            }
          }
          setActiveLocale('en');
        }}>EN</button>
        <span className={styles.localeDivider}>|</span>
        <button type="button" className={`${styles.localeTab} ${activeLocale === 'ja' ? styles.localeTabActive : ''}`} onClick={() => {
          if (editorJa && editor) {
            const jaHtml = editorJa.getHTML();
            if (!jaHtml || jaHtml === '<p></p>') {
              editorJa.commands.setContent(editor.getHTML());
            }
          }
          setActiveLocale('ja');
        }}>JP</button>
      </div>

      {activeLocale === 'ko' && (
        <>
          <div className={styles.titleRow}>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="아티클 제목 (한국어)"
              className={styles.titleInput}
            />
          </div>
        </>
      )}

      {activeLocale === 'en' && (
        <>
          <div className={styles.titleRow}>
            <input
              type="text"
              value={titleEn}
              onChange={(e) => setTitleEn(e.target.value)}
              placeholder="Article Title (English)"
              className={styles.titleInput}
            />
          </div>
        </>
      )}

      {activeLocale === 'ja' && (
        <>
          <div className={styles.titleRow}>
            <input
              type="text"
              value={titleJa}
              onChange={(e) => setTitleJa(e.target.value)}
              placeholder="記事タイトル (日本語)"
              className={styles.titleInput}
            />
          </div>
        </>
      )}

      <div className={styles.coverSection}>
        <div className={styles.coverHeader}>
          <span className={styles.coverTitle}>대표 이미지</span>
          <div className={styles.coverActions}>
            <button
              type="button"
              className={styles.coverUploadBtn}
              onClick={() => coverFileInputRef.current?.click()}
            >
              이미지 선택
            </button>
            {(coverImageUrl || pendingCoverPreview) && (
              <button
                type="button"
                className={styles.coverClearBtn}
                onClick={handleCoverClear}
              >
                제거
              </button>
            )}
          </div>
        </div>
        {(pendingCoverPreview || coverImageUrl) ? (
          <div className={styles.coverPreview}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={pendingCoverPreview ?? coverImageUrl ?? ''}
              alt="대표 이미지 미리보기"
              className={styles.coverPreviewImg}
            />
            {pendingCoverPreview && (
              <span className={styles.coverPendingBadge}>저장 시 업로드됩니다</span>
            )}
          </div>
        ) : (
          <p className={styles.coverHint}>대표 이미지를 선택해주세요.</p>
        )}
        <input
          ref={coverFileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleCoverFileChange}
        />
      </div>

      {activeLocale === 'ko' && (
        <div className={styles.editorWrapper}>
          <Toolbar
            editor={editor}
            onUploadClick={() => fileInputRef.current?.click()}
            isUploading={isUploading}
            uploadError={uploadError}
          />
          <EditorContent editor={editor} className={styles.editorArea} />
        </div>
      )}

      {activeLocale === 'en' && (
        <div className={styles.editorWrapper}>
          <Toolbar editor={editorEn} onUploadClick={() => {}} isUploading={false} uploadError={null} />
          <EditorContent editor={editorEn} className={styles.editorArea} />
        </div>
      )}

      {activeLocale === 'ja' && (
        <div className={styles.editorWrapper}>
          <Toolbar editor={editorJa} onUploadClick={() => {}} isUploading={false} uploadError={null} />
          <EditorContent editor={editorJa} className={styles.editorArea} />
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileInputChange}
      />
    </div>
  );
}

function Toolbar({
  editor,
  onUploadClick,
  isUploading,
  uploadError,
}: {
  editor: Editor | null;
  onUploadClick: () => void;
  isUploading: boolean;
  uploadError: string | null;
}) {
  if (!editor) return null;

  const btn = (
    label: string,
    action: () => void,
    active?: boolean,
    disabled?: boolean
  ) => (
    <button
      key={label}
      type="button"
      onMouseDown={(e) => { e.preventDefault(); action(); }}
      disabled={disabled}
      className={`${styles.toolbarBtn} ${active ? styles.toolbarBtnActive : ''}`}
    >
      {label}
    </button>
  );

  return (
    <div className={styles.toolbar}>
      {btn('B', () => editor.chain().focus().toggleBold().run(), editor.isActive('bold'))}
      {btn('I', () => editor.chain().focus().toggleItalic().run(), editor.isActive('italic'))}
      {btn('S', () => editor.chain().focus().toggleStrike().run(), editor.isActive('strike'))}
      <span className={styles.divider} />
      {btn('H1', () => editor.chain().focus().toggleHeading({ level: 1 }).run(), editor.isActive('heading', { level: 1 }))}
      {btn('H2', () => editor.chain().focus().toggleHeading({ level: 2 }).run(), editor.isActive('heading', { level: 2 }))}
      {btn('H3', () => editor.chain().focus().toggleHeading({ level: 3 }).run(), editor.isActive('heading', { level: 3 }))}
      <span className={styles.divider} />
      {btn('• 목록', () => editor.chain().focus().toggleBulletList().run(), editor.isActive('bulletList'))}
      {btn('1. 목록', () => editor.chain().focus().toggleOrderedList().run(), editor.isActive('orderedList'))}
      {btn('" "', () => editor.chain().focus().toggleBlockquote().run(), editor.isActive('blockquote'))}
      {btn('{ }', () => editor.chain().focus().toggleCodeBlock().run(), editor.isActive('codeBlock'))}
      <span className={styles.divider} />
      {btn(
        '🔗 링크',
        () => {
          if (editor.isActive('link')) {
            editor.chain().focus().unsetLink().run();
            return;
          }
          const url = window.prompt('URL을 입력하세요');
          if (!url) return;
          editor.chain().focus().extendMarkRange('link').setLink({ href: url, target: '_blank' }).run();
        },
        editor.isActive('link'),
      )}
      {btn('—', () => editor.chain().focus().setHorizontalRule().run())}
      {btn(
        isUploading ? '이미지 업로드 중...' : '이미지 업로드',
        onUploadClick,
        false,
        isUploading
      )}
      {uploadError && <span className={styles.errorMsg}>{uploadError}</span>}
    </div>
  );
}
