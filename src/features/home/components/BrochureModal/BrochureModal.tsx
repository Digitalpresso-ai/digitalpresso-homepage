// src/features/home/components/BrochureModal/BrochureModal.tsx

'use client';

import { useEffect, useRef, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { trackEvent } from '@/lib/analytics/gtag';
import {
  brochureRequestSchema,
  type BrochureRequestData,
} from '../../types/brochure.types';
import styles from './BrochureModal.module.css';

interface BrochureModalProps {
  open: boolean;
  onClose: () => void;
}

export function BrochureModal({ open, onClose }: BrochureModalProps) {
  const t = useTranslations('home.ctaCards.brochureModal');
  const dialogRef = useRef<HTMLDivElement>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<BrochureRequestData>({
    resolver: zodResolver(brochureRequestSchema),
    mode: 'onChange',
    defaultValues: { email: '', privacyConsent: false },
  });

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      reset({ email: '', privacyConsent: false });
      setIsSuccess(false);
      setSubmitError(null);
    }
  }, [open, reset]);

  const getErrorMessage = (messageKey: string | undefined): string => {
    switch (messageKey) {
      case 'emailRequired': return t('errors.emailRequired');
      case 'emailInvalid': return t('errors.emailInvalid');
      case 'privacyRequired': return t('errors.privacyRequired');
      default: return messageKey ?? '';
    }
  };

  const onSubmit = async (data: BrochureRequestData) => {
    setSubmitError(null);

    try {
      const response = await fetch('/api/brochure-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      trackEvent('generate_lead', { form: 'brochure' });
      setIsSuccess(true);
    } catch {
      setSubmitError(t('errorMessage'));
    }
  };

  if (!open) return null;

  return (
    <div
      className={styles.overlay}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="brochure-modal-title"
      >
        <button
          type="button"
          className={styles.closeButton}
          onClick={onClose}
          aria-label={t('close')}
        >
          <X size={20} strokeWidth={2} aria-hidden="true" />
        </button>

        {isSuccess ? (
          <div className={styles.successWrapper}>
            <div className={styles.successIcon} aria-hidden="true">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="24" fill="#2b7fff" fillOpacity="0.1" />
                <path
                  d="M14 24L21 31L34 17"
                  stroke="#2b7fff"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <p className={styles.successMessage}>{t('successMessage')}</p>
            <p className={styles.successSubMessage}>{t('successSubMessage')}</p>
            <button type="button" className={styles.submitButton} onClick={onClose}>
              {t('closeButton')}
            </button>
          </div>
        ) : (
          <>
            <h2 id="brochure-modal-title" className={styles.title}>
              {t('title')}
            </h2>
            <p className={styles.desc}>{t('desc')}</p>

            <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className={styles.fieldGroup}>
                <label htmlFor="brochure-email" className={styles.label}>
                  {t('email.label')}
                  <span className={styles.required}>*</span>
                </label>
                <input
                  id="brochure-email"
                  type="email"
                  placeholder={t('email.placeholder')}
                  className={styles.input}
                  aria-invalid={!!errors.email}
                  {...register('email')}
                />
                {errors.email && (
                  <span className={styles.errorText} role="alert">
                    {getErrorMessage(errors.email.message)}
                  </span>
                )}
              </div>

              <div className={styles.privacyRow}>
                <label className={styles.privacyLabel}>
                  <Controller
                    name="privacyConsent"
                    control={control}
                    render={({ field }) => (
                      <input
                        type="checkbox"
                        className={styles.checkbox}
                        checked={!!field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                    )}
                  />
                  <span className={styles.privacyText}>{t('privacy.label')}</span>
                  <span className={styles.required}>*</span>
                </label>
                <p className={styles.privacyDetail}>{t('privacy.detail')}</p>
                {errors.privacyConsent && (
                  <span className={styles.errorText} role="alert">
                    {getErrorMessage(errors.privacyConsent.message)}
                  </span>
                )}
              </div>

              {submitError && (
                <p className={styles.submitError} role="alert">
                  {submitError}
                </p>
              )}

              <button
                type="submit"
                className={styles.submitButton}
                disabled={!isValid || isSubmitting}
              >
                {isSubmitting ? t('submitting') : t('submit')}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
