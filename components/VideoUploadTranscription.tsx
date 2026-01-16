import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { Video, Upload, CheckCircle, FileVideo } from 'lucide-react-native';
import * as DocumentPicker from 'expo-document-picker';

interface VideoUploadTranscriptionProps {
  existingVideoUrl?: string;
  existingTranscription?: string;
  onVideoUploaded: (videoUrl: string, transcription: string) => void;
}

export default function VideoUploadTranscription({
  existingVideoUrl,
  existingTranscription,
  onVideoUploaded,
}: VideoUploadTranscriptionProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(existingVideoUrl || null);
  const [transcription, setTranscription] = useState<string | null>(existingTranscription || null);
  const [fileName, setFileName] = useState<string | null>(null);

  const pickVideo = async () => {
    try {
      setIsUploading(true);

      const result = await DocumentPicker.getDocumentAsync({
        type: 'video/*',
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        setIsUploading(false);
        return;
      }

      const file = result.assets[0];
      setFileName(file.name);

      // TODO: Upload to cloud storage (S3, Cloudinary, etc.)
      // For now, use local URI
      const uploadedUrl = file.uri;
      setVideoUrl(uploadedUrl);
      setIsUploading(false);

      // Start transcription
      await transcribeVideo(uploadedUrl);

    } catch (err) {
      console.error('Error picking video:', err);
      Alert.alert('Ошибка', 'Не удалось загрузить видео');
      setIsUploading(false);
    }
  };

  const transcribeVideo = async (url: string) => {
    setIsTranscribing(true);

    try {
      // TODO: Implement actual transcription with AI (Whisper API, Google Speech-to-Text, etc.)
      // For now, simulate transcription

      await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate API call

      const mockTranscription = `Здравствуйте! Меня зовут Иван, я Frontend разработчик с 7-летним опытом работы.

Я специализируюсь на React и TypeScript, работал над крупными проектами в финтех и e-commerce сферах.

Мой последний проект - это SaaS платформа для управления подписками, где я был тех-лидом команды из 5 разработчиков. Мы использовали React, Next.js, TypeScript и GraphQL.

В свободное время я контрибьючу в open-source проекты и веду технический блог о современных веб-технологиях.

Мои ключевые навыки: React, TypeScript, Next.js, Node.js, PostgreSQL, AWS, Docker, CI/CD.

Ищу новые вызовы в продуктовой компании, где смогу применить свой опыт и расти как специалист.`;

      setTranscription(mockTranscription);
      setIsTranscribing(false);
      onVideoUploaded(url, mockTranscription);

    } catch (error) {
      console.error('Error transcribing video:', error);
      Alert.alert('Ошибка', 'Не удалось транскрибировать видео');
      setIsTranscribing(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Video size={24} color="#8B5CF6" />
        <Text style={styles.title}>Видео-интервью</Text>
      </View>

      <Text style={styles.description}>
        Загрузите видео-интервью кандидата. AI автоматически создаст текстовую транскрипцию.
      </Text>

      {!videoUrl ? (
        <TouchableOpacity
          onPress={pickVideo}
          disabled={isUploading}
          style={[
            styles.uploadBox,
            isUploading ? styles.uploadBoxDisabled : styles.uploadBoxActive,
          ]}
        >
          {isUploading ? (
            <ActivityIndicator size="large" color="#8B5CF6" />
          ) : (
            <>
              <Upload size={48} color="#8B5CF6" />
              <Text style={styles.uploadText}>Загрузить видео</Text>
              <Text style={styles.uploadHint}>MP4, MOV, до 100 МБ</Text>
            </>
          )}
        </TouchableOpacity>
      ) : (
        <View>
          {/* Video File Info */}
          <View style={styles.videoCard}>
            <View style={styles.videoHeader}>
              <View style={styles.videoNameRow}>
                <FileVideo size={20} color="#8B5CF6" />
                <Text style={styles.videoName} numberOfLines={1}>
                  {fileName || 'Видео загружено'}
                </Text>
              </View>

              {isTranscribing && (
                <ActivityIndicator size="small" color="#8B5CF6" style={styles.indicator} />
              )}

              {transcription && (
                <CheckCircle size={20} color="#10B981" style={styles.indicator} />
              )}
            </View>

            {isTranscribing && (
              <View style={styles.progressSection}>
                <Text style={styles.progressText}>
                  Транскрибация видео с помощью AI...
                </Text>
                <View style={styles.progressTrack}>
                  <View style={styles.progressBar} />
                </View>
              </View>
            )}

            {transcription && (
              <View style={styles.successBox}>
                <Text style={styles.successText}>
                  ✓ Транскрипция готова
                </Text>
              </View>
            )}

            {!isTranscribing && videoUrl && (
              <TouchableOpacity
                onPress={pickVideo}
                style={styles.replaceButton}
              >
                <Text style={styles.replaceButtonText}>Загрузить другое видео</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Transcription Preview */}
          {transcription && (
            <View style={styles.transcriptionBox}>
              <Text style={styles.transcriptionLabel}>Транскрипция:</Text>
              <Text style={styles.transcriptionText} numberOfLines={8}>
                {transcription}
              </Text>
              <TouchableOpacity style={styles.expandButton}>
                <Text style={styles.expandButtonText}>Показать полностью</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
    color: '#000000',
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  uploadBox: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 32,
    alignItems: 'center',
  },
  uploadBoxActive: {
    borderColor: '#D8B4FE',
    backgroundColor: '#FAF5FF',
  },
  uploadBoxDisabled: {
    borderColor: '#D1D5DB',
    backgroundColor: '#F9FAFB',
  },
  uploadText: {
    color: '#7C3AED',
    fontWeight: '500',
    marginTop: 12,
    fontSize: 16,
  },
  uploadHint: {
    color: '#6B7280',
    fontSize: 12,
    marginTop: 4,
  },
  videoCard: {
    backgroundColor: '#FAF5FF',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E9D5FF',
  },
  videoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  videoNameRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  videoName: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
    flex: 1,
    color: '#111827',
  },
  indicator: {
    marginLeft: 8,
  },
  progressSection: {
    marginTop: 12,
  },
  progressText: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  },
  progressTrack: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#8B5CF6',
    borderRadius: 2,
    width: '70%',
  },
  successBox: {
    marginTop: 12,
    backgroundColor: '#ECFDF5',
    padding: 12,
    borderRadius: 8,
  },
  successText: {
    fontSize: 14,
    color: '#065F46',
    fontWeight: '500',
  },
  replaceButton: {
    marginTop: 12,
  },
  replaceButtonText: {
    fontSize: 14,
    color: '#7C3AED',
  },
  transcriptionBox: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginTop: 16,
  },
  transcriptionLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#111827',
  },
  transcriptionText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  expandButton: {
    marginTop: 12,
  },
  expandButtonText: {
    fontSize: 14,
    color: '#2563EB',
  },
});
