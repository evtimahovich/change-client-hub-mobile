import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { Upload, FileText, CheckCircle } from 'lucide-react-native';
import * as DocumentPicker from 'expo-document-picker';

interface ParsedCandidateData {
  name?: string;
  position?: string;
  email?: string;
  phone?: string;
  location?: string;
  experienceYears?: number;
  skills?: string[];
  salaryExpectation?: number;
}

interface PDFUploadParserProps {
  onDataParsed: (data: ParsedCandidateData) => void;
}

export default function PDFUploadParser({ onDataParsed }: PDFUploadParserProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const pickDocument = async () => {
    try {
      setIsUploading(true);

      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        setIsUploading(false);
        return;
      }

      const file = result.assets[0];
      setFileName(file.name);
      setIsUploading(false);

      // Start parsing
      await parseResume(file);

    } catch (err) {
      console.error('Error picking document:', err);
      Alert.alert('Ошибка', 'Не удалось загрузить файл');
      setIsUploading(false);
    }
  };

  const parseResume = async (file: any) => {
    setIsParsing(true);

    try {
      // TODO: Implement actual AI parsing with Gemini API
      // For now, simulate parsing with mock data

      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call

      const mockParsedData: ParsedCandidateData = {
        name: "Иван Иванов",
        position: "Senior Frontend Developer",
        email: "ivan.ivanov@example.com",
        phone: "+7 (777) 123-4567",
        location: "Алматы",
        experienceYears: 7,
        skills: ["React", "TypeScript", "Next.js", "Node.js", "AWS"],
        salaryExpectation: 5000,
      };

      onDataParsed(mockParsedData);
      setIsCompleted(true);
      setIsParsing(false);

    } catch (error) {
      console.error('Error parsing resume:', error);
      Alert.alert('Ошибка', 'Не удалось распарсить резюме');
      setIsParsing(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <FileText size={24} color="#0066FF" />
        <Text style={styles.title}>Загрузить резюме (PDF)</Text>
      </View>

      <Text style={styles.description}>
        Загрузите PDF резюме кандидата. AI автоматически извлечет всю информацию и заполнит карточку.
      </Text>

      {!fileName ? (
        <TouchableOpacity
          onPress={pickDocument}
          disabled={isUploading}
          style={[
            styles.uploadBox,
            isUploading ? styles.uploadBoxDisabled : styles.uploadBoxActive,
          ]}
        >
          {isUploading ? (
            <ActivityIndicator size="large" color="#0066FF" />
          ) : (
            <>
              <Upload size={48} color="#0066FF" />
              <Text style={styles.uploadText}>Выбрать файл</Text>
              <Text style={styles.uploadHint}>PDF, до 10 МБ</Text>
            </>
          )}
        </TouchableOpacity>
      ) : (
        <View style={styles.fileCard}>
          <View style={styles.fileHeader}>
            <View style={styles.fileNameRow}>
              <FileText size={20} color="#0066FF" />
              <Text style={styles.fileName} numberOfLines={1}>
                {fileName}
              </Text>
            </View>

            {isParsing && (
              <ActivityIndicator size="small" color="#0066FF" style={styles.indicator} />
            )}

            {isCompleted && (
              <CheckCircle size={20} color="#10B981" style={styles.indicator} />
            )}
          </View>

          {isParsing && (
            <View style={styles.progressSection}>
              <Text style={styles.progressText}>Парсинг резюме с помощью AI...</Text>
              <View style={styles.progressTrack}>
                <View style={styles.progressBar} />
              </View>
            </View>
          )}

          {isCompleted && (
            <View style={styles.successBox}>
              <Text style={styles.successTitle}>
                ✓ Резюме успешно обработано
              </Text>
              <Text style={styles.successText}>
                Все поля карточки заполнены автоматически. Проверьте и отредактируйте при необходимости.
              </Text>
            </View>
          )}

          {!isParsing && !isCompleted && (
            <TouchableOpacity
              onPress={pickDocument}
              style={styles.replaceButton}
            >
              <Text style={styles.replaceButtonText}>Загрузить другой файл</Text>
            </TouchableOpacity>
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
    borderColor: '#93C5FD',
    backgroundColor: '#EFF6FF',
  },
  uploadBoxDisabled: {
    borderColor: '#D1D5DB',
    backgroundColor: '#F9FAFB',
  },
  uploadText: {
    color: '#2563EB',
    fontWeight: '500',
    marginTop: 12,
    fontSize: 16,
  },
  uploadHint: {
    color: '#6B7280',
    fontSize: 12,
    marginTop: 4,
  },
  fileCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  fileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fileNameRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  fileName: {
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
    backgroundColor: '#2563EB',
    borderRadius: 2,
    width: '60%',
  },
  successBox: {
    marginTop: 12,
    backgroundColor: '#ECFDF5',
    padding: 12,
    borderRadius: 8,
  },
  successTitle: {
    fontSize: 14,
    color: '#065F46',
    fontWeight: '500',
  },
  successText: {
    fontSize: 12,
    color: '#047857',
    marginTop: 4,
  },
  replaceButton: {
    marginTop: 12,
  },
  replaceButtonText: {
    fontSize: 14,
    color: '#2563EB',
  },
});
