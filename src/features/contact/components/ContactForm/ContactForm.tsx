// src/features/contact/components/ContactForm/ContactForm.tsx

'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import {
  contactFormSchema,
  type ContactFormData,
  InquiryType,
  SourceType,
} from '../../types/contact.types';
import styles from './ContactForm.module.css';

const INQUIRY_TYPE_OPTIONS: { value: InquiryType; labelKey: string }[] = [
  { value: InquiryType.INVESTMENT, labelKey: 'investment' },
  { value: InquiryType.SERVICE, labelKey: 'service' },
  { value: InquiryType.FEATURE, labelKey: 'feature' },
  { value: InquiryType.ERROR, labelKey: 'error' },
  { value: InquiryType.OTHER, labelKey: 'other' },
];

const SOURCE_TYPE_OPTIONS: { value: SourceType; labelKey: string }[] = [
  { value: SourceType.EXHIBITION, labelKey: 'exhibition' },
  { value: SourceType.SNS, labelKey: 'sns' },
  { value: SourceType.MARKETING, labelKey: 'marketing' },
  { value: SourceType.REFERRAL, labelKey: 'referral' },
  { value: SourceType.OTHER_CHANNEL, labelKey: 'other' },
];

const PHONE_FORMAT_REGEX = /[^0-9]/g;

function formatPhoneNumber(raw: string): string {
  const digits = raw.replace(PHONE_FORMAT_REGEX, '');
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
}

function SuccessView({
  message,
  subMessage,
}: {
  message: string;
  subMessage: string;
}) {
  return (
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
      <p className={styles.successMessage}>{message}</p>
      <p className={styles.successSubMessage}>{subMessage}</p>
    </div>
  );
}

export function ContactForm() {
  const t = useTranslations('contact.form');
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isValid },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    mode: 'onChange',
  });

  const getErrorMessage = (messageKey: string | undefined): string => {
    switch (messageKey) {
      case 'inquiryTypeRequired': return t('errors.inquiryTypeRequired');
      case 'organizationRequired': return t('errors.organizationRequired');
      case 'nameRequired':         return t('errors.nameRequired');
      case 'emailRequired':        return t('errors.emailRequired');
      case 'emailInvalid':         return t('errors.emailInvalid');
      case 'sourceRequired':       return t('errors.sourceRequired');
      case 'messageRequired':      return t('errors.messageRequired');
      case 'privacyRequired':      return t('errors.privacyRequired');
      default:                     return messageKey ?? '';
    }
  };

  const onSubmit = async (data: ContactFormData) => {
    setSubmitError(null);

    const formData = new FormData();
    formData.append('inquiryType', data.inquiryType);
    formData.append('organization', data.organization);
    formData.append('name', data.name);
    formData.append('email', data.email);
    if (data.phone) formData.append('phone', data.phone);
    formData.append('source', data.source);
    formData.append('message', data.message);
    formData.append('privacyConsent', String(data.privacyConsent));

    try {
      const response = await fetch('https://api.renamedp.ai/v1/inquery', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      setIsSuccess(true);
    } catch {
      setSubmitError(t('errorMessage'));
    }
  };

  if (isSuccess) {
    return (
      <SuccessView
        message={t('successMessage')}
        subMessage={t('successSubMessage')}
      />
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
      {/* 문의 유형 */}
      <div className={styles.fieldGroup}>
        <label className={styles.label}>
          {t('inquiryType.label')}
          <span className={styles.required}>*</span>
        </label>
        <Controller
          name="inquiryType"
          control={control}
          render={({ field }) => (
            <div className={styles.chipGroup} role="group" aria-label={t('inquiryType.label')}>
              {INQUIRY_TYPE_OPTIONS.map(({ value, labelKey }) => (
                <button
                  key={value}
                  type="button"
                  className={`${styles.chip} ${field.value === value ? styles.chipSelected : ''}`}
                  onClick={() => field.onChange(value)}
                  aria-pressed={field.value === value}
                >
                  {t(`inquiryType.options.${labelKey}`)}
                </button>
              ))}
            </div>
          )}
        />
        {errors.inquiryType && (
          <span className={styles.errorText} role="alert">
            {getErrorMessage(errors.inquiryType.message)}
          </span>
        )}
      </div>

      {/* 소속 / 이름 */}
      <div className={styles.row}>
        <div className={styles.fieldGroup}>
          <label htmlFor="contact-organization" className={styles.label}>
            {t('organization.label')}
            <span className={styles.required}>*</span>
          </label>
          <input
            id="contact-organization"
            type="text"
            placeholder={t('organization.placeholder')}
            className={styles.input}
            aria-invalid={!!errors.organization}
            {...register('organization')}
          />
          {errors.organization && (
            <span className={styles.errorText} role="alert">
              {getErrorMessage(errors.organization.message)}
            </span>
          )}
        </div>

        <div className={styles.fieldGroup}>
          <label htmlFor="contact-name" className={styles.label}>
            {t('name.label')}
            <span className={styles.required}>*</span>
          </label>
          <input
            id="contact-name"
            type="text"
            placeholder={t('name.placeholder')}
            className={styles.input}
            aria-invalid={!!errors.name}
            {...register('name')}
          />
          {errors.name && (
            <span className={styles.errorText} role="alert">
              {getErrorMessage(errors.name.message)}
            </span>
          )}
        </div>
      </div>

      {/* 이메일 / 연락처 */}
      <div className={styles.row}>
        <div className={styles.fieldGroup}>
          <label htmlFor="contact-email" className={styles.label}>
            {t('email.label')}
            <span className={styles.required}>*</span>
          </label>
          <input
            id="contact-email"
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

        <div className={styles.fieldGroup}>
          <label htmlFor="contact-phone" className={styles.label}>
            {t('phone.label')}
          </label>
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <input
                id="contact-phone"
                type="tel"
                placeholder={t('phone.placeholder')}
                className={styles.input}
                value={field.value ?? ''}
                onChange={(e) => field.onChange(formatPhoneNumber(e.target.value))}
              />
            )}
          />
        </div>
      </div>

      {/* 유입 경로 */}
      <div className={styles.fieldGroup}>
        <label className={styles.label}>
          {t('source.label')}
          <span className={styles.required}>*</span>
        </label>
        <Controller
          name="source"
          control={control}
          render={({ field }) => (
            <div className={styles.chipGroup} role="group" aria-label={t('source.label')}>
              {SOURCE_TYPE_OPTIONS.map(({ value, labelKey }) => (
                <button
                  key={value}
                  type="button"
                  className={`${styles.chip} ${field.value === value ? styles.chipSelected : ''}`}
                  onClick={() => field.onChange(value)}
                  aria-pressed={field.value === value}
                >
                  {t(`source.options.${labelKey}`)}
                </button>
              ))}
            </div>
          )}
        />
        {errors.source && (
          <span className={styles.errorText} role="alert">
            {getErrorMessage(errors.source.message)}
          </span>
        )}
      </div>

      {/* 문의 내용 */}
      <div className={styles.fieldGroup}>
        <label htmlFor="contact-message" className={styles.label}>
          {t('message.label')}
          <span className={styles.required}>*</span>
        </label>
        <textarea
          id="contact-message"
          placeholder={t('message.placeholder')}
          className={styles.textarea}
          rows={6}
          aria-invalid={!!errors.message}
          {...register('message')}
        />
        {errors.message && (
          <span className={styles.errorText} role="alert">
            {getErrorMessage(errors.message.message)}
          </span>
        )}
      </div>

      {/* 개인정보 동의 */}
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
        {errors.privacyConsent && (
          <span className={styles.errorText} role="alert">
            {getErrorMessage(errors.privacyConsent.message)}
          </span>
        )}
      </div>

      {/* 제출 오류 메시지 */}
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
        {isSubmitting ? '...' : t('submit')}
      </button>
    </form>
  );
}
