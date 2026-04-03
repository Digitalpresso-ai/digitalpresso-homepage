'use client';

import { useEditor, EditorContent, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TiptapImage from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { useEffect, useRef, useState, useTransition, type ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { createClient as createBrowserClient } from '@/lib/supabase/client';
import { createArticleShell, updateArticle } from '@/src/features/admin/actions/article.actions';
import type { ArticleEntity, ArticleFormData, NewsCategory } from '@/src/features/news/types/article.types';
import styles from './ArticleEditor.module.css';

interface Props {
  article?: ArticleEntity;
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
  const editorRef = useRef<Editor | null>(null);
  const [pendingImages, setPendingImages] = useState<Record<string, File>>({});
  const [coverSelection, setCoverSelection] = useState<
    { type: 'url'; value: string } | { type: 'temp'; value: string } | null
  >(article?.cover_img_url ? { type: 'url', value: article.cover_img_url } : null);
  const [imagesInEditor, setImagesInEditor] = useState<
    { src: string; alt: string; tempId: string | null }[]
  >([]);

  const [title, setTitle] = useState(article?.title ?? '');
  const [titleEn, setTitleEn] = useState(article?.title_en ?? '');
  const [titleJa, setTitleJa] = useState(article?.title_ja ?? '');
  const [activeLocale, setActiveLocale] = useState<'ko' | 'en' | 'ja'>('ko');
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

    const tempId = crypto.randomUUID();
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
      handlePaste: (_view, event) => {
        const items = Array.from(event.clipboardData?.items ?? []);
        const imageItem = items.find((item) => item.type.startsWith('image/'));
        if (!imageItem) return false;
        const file = imageItem.getAsFile();
        if (!file) return false;
        event.preventDefault();
        void handleImageUpload(file);
        return true;
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
    editorProps: { attributes: { class: styles.editorContent } },
  });

  const editorJa = useEditor({
    immediatelyRender: false,
    extensions: [
      ...sharedExtensions,
      Placeholder.configure({ placeholder: '日本語で記事の内容を入力してください...' }),
    ],
    content: article?.content_ja ?? '',
    editorProps: { attributes: { class: styles.editorContent } },
  });

  useEffect(() => {
    if (!editor) return;

    const updateImages = () => {
      const html = editor.getHTML();
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const imgs = Array.from(doc.querySelectorAll('img')).map((img) => ({
        src: img.getAttribute('src') ?? '',
        alt: img.getAttribute('alt') ?? '',
        tempId: img.getAttribute('data-temp-id'),
      }));
      setImagesInEditor(imgs.filter((img) => img.src));
    };

    updateImages();
    editor.on('update', updateImages);

    return () => {
      editor.off('update', updateImages);
    };
  }, [editor]);

  const handleFileInputChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    await handleImageUpload(file);
    event.target.value = '';
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
        let resolvedCoverUrl =
          coverSelection?.type === 'url' ? coverSelection.value
          : coverSelection?.type === 'temp' ? null
          : null;
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

            const objectKey = crypto.randomUUID();
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

            if (coverSelection?.type === 'temp' && coverSelection.value === tempId) {
              resolvedCoverUrl = imageUrl;
            }
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
        if (resolvedCoverUrl) {
          setCoverSelection({ type: 'url', value: resolvedCoverUrl });
        } else {
          setCoverSelection(null);
        }
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
          {saveSuccess && <span className={styles.successMsg}>저장됨 ✓</span>}
          <button
            type="button"
            onClick={() => handleSubmit()}
            disabled={isPending || isUploading}
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
          <button
            type="button"
            className={styles.coverClearBtn}
            onClick={() => setCoverSelection(null)}
          >
            없음
          </button>
        </div>
        {imagesInEditor.length === 0 ? (
          <p className={styles.coverHint}>본문에 이미지가 있어야 선택할 수 있습니다.</p>
        ) : (
          <div className={styles.coverGrid}>
            {imagesInEditor.map((img, index) => {
              const isSelected = coverSelection
                ? coverSelection.type === 'temp'
                  ? coverSelection.value === img.tempId
                  : coverSelection.value === img.src
                : false;
              return (
                <button
                  key={`${img.src}-${index}`}
                  type="button"
                  className={`${styles.coverItem} ${isSelected ? styles.coverItemActive : ''}`}
                  onClick={() => {
                    if (img.tempId) {
                      setCoverSelection({ type: 'temp', value: img.tempId });
                    } else {
                      setCoverSelection({ type: 'url', value: img.src });
                    }
                  }}
                >
                  <img src={img.src} alt={img.alt || 'cover'} />
                </button>
              );
            })}
          </div>
        )}
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
