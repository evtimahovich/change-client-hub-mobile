import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { X, Check, FileText } from 'lucide-react-native';

interface PDFExportOptionsModalProps {
  visible: boolean;
  onClose: () => void;
  onExport: (selectedSections: string[]) => Promise<void>;
  candidateName?: string;
}

export default function PDFExportOptionsModal({
  visible,
  onClose,
  onExport,
  candidateName,
}: PDFExportOptionsModalProps) {
  const [exporting, setExporting] = useState(false);
  const [selectedSections, setSelectedSections] = useState<string[]>([
    'basicInfo', // Always selected by default
    'experience',
    'aiAnalysis',
    'history',
    'verification',
    'comments',
  ]);

  const sections = [
    {
      id: 'basicInfo',
      label: 'Основная информация',
      description: 'Имя, контакты, зарплата, локация',
      required: true,
    },
    {
      id: 'experience',
      label: 'Опыт работы и навыки',
      description: 'Опыт работы, навыки, резюме',
      required: false,
    },
    {
      id: 'aiAnalysis',
      label: 'AI Analysis',
      description: 'Оценка кандидата через AI',
      required: false,
    },
    {
      id: 'history',
      label: 'История взаимодействий',
      description: 'Временная линия всех взаимодействий',
      required: false,
    },
    {
      id: 'verification',
      label: 'Дополнительная проверка',
      description: 'Проверка рекомендаций и безопасности',
      required: false,
    },
    {
      id: 'comments',
      label: 'Комментарии рекрутера',
      description: 'Заметки и комментарии',
      required: false,
    },
  ];

  const toggleSection = (sectionId: string) => {
    // Cannot toggle required sections
    const section = sections.find((s) => s.id === sectionId);
    if (section?.required) return;

    if (selectedSections.includes(sectionId)) {
      setSelectedSections(selectedSections.filter((id) => id !== sectionId));
    } else {
      setSelectedSections([...selectedSections, sectionId]);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      await onExport(selectedSections);
      onClose();
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setExporting(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <FileText size={24} color="#0066FF" />
              <View>
                <Text style={styles.title}>Экспорт в PDF</Text>
                {candidateName && (
                  <Text style={styles.subtitle}>{candidateName}</Text>
                )}
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#000000" />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.sectionTitle}>Выберите разделы для экспорта</Text>
            <Text style={styles.sectionDescription}>
              Отметьте разделы, которые хотите включить в PDF файл
            </Text>

            {sections.map((section) => (
              <TouchableOpacity
                key={section.id}
                style={[
                  styles.checkboxItem,
                  section.required && styles.checkboxItemDisabled,
                ]}
                onPress={() => toggleSection(section.id)}
                activeOpacity={section.required ? 1 : 0.7}
              >
                <View
                  style={[
                    styles.checkbox,
                    selectedSections.includes(section.id) &&
                      styles.checkboxChecked,
                    section.required && styles.checkboxDisabled,
                  ]}
                >
                  {selectedSections.includes(section.id) && (
                    <Check size={16} color="#FFFFFF" />
                  )}
                </View>
                <View style={styles.checkboxContent}>
                  <View style={styles.checkboxLabelRow}>
                    <Text style={styles.checkboxLabel}>{section.label}</Text>
                    {section.required && (
                      <View style={styles.requiredBadge}>
                        <Text style={styles.requiredText}>Обязательно</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.checkboxDescription}>
                    {section.description}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
              disabled={exporting}
            >
              <Text style={styles.cancelButtonText}>Отмена</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.exportButton, exporting && styles.exportButtonDisabled]}
              onPress={handleExport}
              disabled={exporting || selectedSections.length === 0}
            >
              {exporting ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.exportButtonText}>Экспортировать</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: '100%',
    maxWidth: 500,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E4E4E7',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: '#71717A',
    marginTop: 2,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 6,
  },
  sectionDescription: {
    fontSize: 14,
    fontWeight: '400',
    color: '#71717A',
    marginBottom: 20,
    lineHeight: 20,
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E4E4E7',
  },
  checkboxItemDisabled: {
    opacity: 0.6,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: '#0066FF',
    borderColor: '#0066FF',
  },
  checkboxDisabled: {
    backgroundColor: '#E4E4E7',
    borderColor: '#A1A1AA',
  },
  checkboxContent: {
    flex: 1,
  },
  checkboxLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  checkboxLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000000',
  },
  requiredBadge: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  requiredText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1E40AF',
    textTransform: 'uppercase',
  },
  checkboxDescription: {
    fontSize: 13,
    fontWeight: '400',
    color: '#71717A',
    lineHeight: 18,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E4E4E7',
  },
  cancelButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E4E4E7',
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#52525B',
  },
  exportButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#0066FF',
    minWidth: 140,
    alignItems: 'center',
  },
  exportButtonDisabled: {
    opacity: 0.6,
  },
  exportButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
