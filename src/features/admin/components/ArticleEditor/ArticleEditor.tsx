'use client';

import { useEditor, EditorContent, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { useState, useTransition } from 'react';
import { createArticle, updateArticle } from '@/src/features/admin/actions/article.actions';
import type { Article, ArticleFormData } from '@/src/features/news/types/article.types';
import styles from './ArticleEditor.module.css';

interface Props {
  article?: Article;
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function ArticleEditor({ article }: Props) {
  const isEdit = !!article;
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [title, setTitle] = useState(article?.title ?? '');
  // slugOverride: null이면 title에서 자동 생성, 문자열이면 직접 입력한 값
  const [slugOverride, setSlugOverride] = useState<string | null>(
    article?.slug ?? null
  );
  const [excerpt, setExcerpt] = useState(article?.excerpt ?? '');
  const [category, setCategory] = useState(article?.category ?? 'news');

  const slug = slugOverride ?? slugify(title);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Image,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: '본문을 작성하세요...' }),
    ],
    content: article?.content ?? '',
    editorProps: {
      attributes: { class: styles.editorContent },
    },
  });

  const handleSubmit = (submitStatus: 'draft' | 'published') => {
    const content = editor?.getHTML() ?? '';
    if (!title.trim()) { setServerError('제목을 입력해주세요.'); return; }
    if (!slug.trim()) { setServerError('슬러그를 입력해주세요.'); return; }
    if (!content || content === '<p></p>') { setServerError('본문을 작성해주세요.'); return; }

    setServerError(null);
    setSaveSuccess(false);

    const formData: ArticleFormData = {
      title,
      slug,
      content,
      excerpt: excerpt || null,
      category,
      status: submitStatus,
      cover_image_url: null,
    };

    startTransition(async () => {
      const result = isEdit
        ? await updateArticle(article.id, formData)
        : await createArticle(formData);

      if (result && 'error' in result) {
        setServerError(result.error);
      } else if (isEdit) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <div className={styles.meta}>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={styles.select}
          >
            <option value="news">뉴스</option>
            <option value="update">업데이트</option>
            <option value="case-study">케이스 스터디</option>
            <option value="insight">인사이트</option>
          </select>
        </div>
        <div className={styles.actions}>
          {serverError && <span className={styles.errorMsg}>{serverError}</span>}
          {saveSuccess && <span className={styles.successMsg}>저장됨 ✓</span>}
          <button
            type="button"
            onClick={() => handleSubmit('draft')}
            disabled={isPending}
            className={styles.draftBtn}
          >
            {isPending ? '저장 중...' : '임시저장'}
          </button>
          <button
            type="button"
            onClick={() => handleSubmit('published')}
            disabled={isPending}
            className={styles.publishBtn}
          >
            {isPending ? '발행 중...' : '발행'}
          </button>
        </div>
      </div>

      <div className={styles.titleRow}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="아티클 제목"
          className={styles.titleInput}
        />
        <div className={styles.slugRow}>
          <span className={styles.slugPrefix}>/news/</span>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlugOverride(e.target.value)}
            placeholder="url-slug"
            className={styles.slugInput}
          />
        </div>
      </div>

      <input
        type="text"
        value={excerpt}
        onChange={(e) => setExcerpt(e.target.value)}
        placeholder="요약 (검색 결과 및 목록에 표시됩니다)"
        className={styles.excerptInput}
      />

      <div className={styles.editorWrapper}>
        <Toolbar editor={editor} />
        <EditorContent editor={editor} className={styles.editorArea} />
      </div>
    </div>
  );
}

function Toolbar({ editor }: { editor: Editor | null }) {
  if (!editor) return null;

  const btn = (label: string, action: () => void, active?: boolean) => (
    <button
      key={label}
      type="button"
      onMouseDown={(e) => { e.preventDefault(); action(); }}
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
      {btn('—', () => editor.chain().focus().setHorizontalRule().run())}
    </div>
  );
}
