import { Platform, Alert } from 'react-native';
import * as Sharing from 'expo-sharing';
import { Candidate } from '../types';
import { generateCandidatePDFHTML } from '../utils/candidatePDFTemplate';

// Динамический импорт только для нативных платформ
let generatePDF: any = null;

// Отложенная инициализация - только при реальном использовании
async function initializePDF() {
  if (Platform.OS !== 'web' && !generatePDF) {
    try {
      const htmlToPdf = await import('react-native-html-to-pdf') as { default?: any; convert?: any };
      generatePDF = htmlToPdf.default || htmlToPdf;
    } catch (error) {
      console.warn('react-native-html-to-pdf not available:', error);
    }
  }
}

export interface PDFExportOptions {
  candidate: Candidate;
  selectedSections: string[];
}

/**
 * Export candidate profile to PDF
 * @param options - Export options including candidate data and selected sections
 * @returns Promise with the file path of generated PDF
 */
export async function exportCandidateToPDF(
  options: PDFExportOptions
): Promise<string> {
  try {
    // Проверка доступности на платформе
    if (Platform.OS === 'web') {
      // Для веб-версии - просто показываем HTML в новом окне
      const { candidate, selectedSections } = options;
      const htmlContent = generateCandidatePDFHTML(candidate, selectedSections);

      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        printWindow.print();
      }

      Alert.alert(
        'PDF экспорт',
        'На веб-платформе используйте функцию печати браузера для сохранения в PDF'
      );
      return 'web-print';
    }

    // Инициализируем PDF библиотеку при первом использовании
    await initializePDF();

    if (!generatePDF) {
      throw new Error('PDF generation is not available on this platform');
    }

    const { candidate, selectedSections } = options;

    // Generate HTML content from template
    const htmlContent = generateCandidatePDFHTML(candidate, selectedSections);

    // Prepare file name (sanitize candidate name for filename)
    const sanitizedName = candidate.name
      .replace(/[^a-zA-Z0-9а-яА-Я\s]/g, '')
      .replace(/\s+/g, '_');
    const fileName = `${sanitizedName}_profile`;

    // Convert HTML to PDF
    const pdfOptions = {
      html: htmlContent,
      fileName,
      directory: 'Documents',
      width: 595, // A4 width in points
      height: 842, // A4 height in points
    };

    const pdf = await generatePDF(pdfOptions);

    // Share the PDF file
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(pdf.filePath, {
        mimeType: 'application/pdf',
        dialogTitle: `Карточка кандидата: ${candidate.name}`,
        UTI: 'com.adobe.pdf',
      });
    } else {
      throw new Error('Sharing is not available on this device');
    }

    return pdf.filePath;
  } catch (error) {
    console.error('PDF export failed:', error);
    throw new Error(
      `Failed to export PDF: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Check if PDF export is available on the current platform
 * @returns Promise with boolean indicating availability
 */
export async function isPDFExportAvailable(): Promise<boolean> {
  try {
    return await Sharing.isAvailableAsync();
  } catch (error) {
    console.error('Failed to check PDF export availability:', error);
    return false;
  }
}
