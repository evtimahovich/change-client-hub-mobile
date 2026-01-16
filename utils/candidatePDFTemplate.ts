import { Candidate } from '../types';

export function generateCandidatePDFHTML(
  candidate: Candidate,
  selectedSections: string[]
): string {
  const styles = `
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        font-size: 14px;
        line-height: 1.5;
        color: #000000;
        padding: 40px;
        background: #ffffff;
      }
      .header {
        border-bottom: 2px solid #E4E4E7;
        padding-bottom: 24px;
        margin-bottom: 32px;
      }
      .header-top {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 16px;
      }
      .name {
        font-size: 32px;
        font-weight: 700;
        color: #000000;
        margin-bottom: 8px;
      }
      .position {
        font-size: 20px;
        font-weight: 600;
        color: #52525B;
        margin-bottom: 12px;
      }
      .contact-info {
        display: flex;
        flex-wrap: wrap;
        gap: 16px;
        margin-top: 12px;
      }
      .contact-item {
        font-size: 14px;
        color: #71717A;
      }
      .section {
        margin-bottom: 32px;
        page-break-inside: avoid;
      }
      .section-title {
        font-size: 20px;
        font-weight: 700;
        color: #000000;
        margin-bottom: 16px;
        padding-bottom: 8px;
        border-bottom: 1px solid #E4E4E7;
      }
      .subsection-title {
        font-size: 16px;
        font-weight: 600;
        color: #000000;
        margin-bottom: 12px;
        margin-top: 16px;
      }
      .info-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;
        margin-bottom: 16px;
      }
      .info-item {
        display: flex;
        flex-direction: column;
      }
      .info-label {
        font-size: 12px;
        font-weight: 600;
        color: #71717A;
        text-transform: uppercase;
        margin-bottom: 4px;
      }
      .info-value {
        font-size: 14px;
        font-weight: 500;
        color: #000000;
      }
      .skills-container {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 12px;
      }
      .skill-chip {
        display: inline-block;
        padding: 6px 12px;
        background-color: #EFF6FF;
        border: 1px solid #BFDBFE;
        border-radius: 16px;
        font-size: 13px;
        font-weight: 500;
        color: #1E40AF;
      }
      .timeline {
        position: relative;
        padding-left: 24px;
        border-left: 2px solid #E4E4E7;
      }
      .timeline-item {
        position: relative;
        padding-bottom: 24px;
        margin-bottom: 16px;
      }
      .timeline-item::before {
        content: '';
        position: absolute;
        left: -28px;
        top: 6px;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: #0066FF;
      }
      .timeline-date {
        font-size: 12px;
        font-weight: 600;
        color: #71717A;
        margin-bottom: 4px;
      }
      .timeline-content {
        font-size: 14px;
        color: #000000;
      }
      .comment {
        background-color: #F9FAFB;
        padding: 16px;
        border-radius: 8px;
        margin-bottom: 12px;
        border-left: 4px solid #0066FF;
      }
      .comment-author {
        font-size: 13px;
        font-weight: 600;
        color: #000000;
        margin-bottom: 6px;
      }
      .comment-text {
        font-size: 14px;
        color: #52525B;
        line-height: 1.6;
      }
      .comment-date {
        font-size: 12px;
        color: #A1A1AA;
        margin-top: 8px;
      }
      .ai-analysis {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 24px;
        border-radius: 12px;
        margin-bottom: 16px;
      }
      .ai-score {
        font-size: 48px;
        font-weight: 700;
        margin-bottom: 12px;
      }
      .ai-breakdown {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
        margin-top: 16px;
      }
      .ai-item {
        font-size: 14px;
      }
      .footer {
        margin-top: 48px;
        padding-top: 24px;
        border-top: 1px solid #E4E4E7;
        text-align: center;
        font-size: 12px;
        color: #A1A1AA;
      }
      .status-badge {
        display: inline-block;
        padding: 6px 12px;
        background-color: #FEF3C7;
        border-radius: 6px;
        font-size: 13px;
        font-weight: 600;
        color: #92400E;
      }
    </style>
  `;

  const header = `
    <div class="header">
      <div class="header-top">
        <div>
          <h1 class="name">${candidate.name}</h1>
          <h2 class="position">${candidate.position}</h2>
          <div class="status-badge">${candidate.status}</div>
        </div>
      </div>
      <div class="contact-info">
        <div class="contact-item">📍 ${candidate.location}</div>
        <div class="contact-item">📧 ${candidate.email}</div>
        <div class="contact-item">📱 ${candidate.phone}</div>
        <div class="contact-item">💰 $${candidate.salaryExpectation}</div>
        <div class="contact-item">📅 ${candidate.experienceYears} лет опыта</div>
        ${candidate.shortlisted ? '<div class="contact-item">⭐ В шортлисте</div>' : ''}
      </div>
    </div>
  `;

  let content = '';

  // Experience and Skills Section
  if (selectedSections.includes('experience')) {
    content += `
      <div class="section">
        <h3 class="section-title">Опыт работы и навыки</h3>

        <div class="subsection-title">Навыки</div>
        <div class="skills-container">
          ${candidate.skills.map((skill) => `<span class="skill-chip">${skill}</span>`).join('')}
        </div>

        <div class="info-grid" style="margin-top: 24px;">
          <div class="info-item">
            <div class="info-label">Опыт работы</div>
            <div class="info-value">${candidate.experienceYears} лет</div>
          </div>
          <div class="info-item">
            <div class="info-label">Позиция</div>
            <div class="info-value">${candidate.position}</div>
          </div>
        </div>

        ${
          candidate.renome
            ? `
          <div class="subsection-title">Резюме</div>
          <p>${candidate.renome}</p>
        `
            : ''
        }
      </div>
    `;
  }

  // AI Analysis Section
  if (selectedSections.includes('aiAnalysis') && candidate.aiAnalysis) {
    content += `
      <div class="section">
        <h3 class="section-title">AI Analysis</h3>
        <div class="ai-analysis">
          <div class="ai-score">${candidate.aiAnalysis.score}%</div>
          <p>${candidate.aiAnalysis.summary}</p>
          <div class="ai-breakdown">
            <div class="ai-item">Hard Skills: ${candidate.aiAnalysis.breakdown.hardSkills}%</div>
            <div class="ai-item">Experience: ${candidate.aiAnalysis.breakdown.experience}%</div>
            <div class="ai-item">Salary Match: ${candidate.aiAnalysis.breakdown.salary}%</div>
            <div class="ai-item">Bonus: ${candidate.aiAnalysis.breakdown.bonus}%</div>
          </div>
        </div>
      </div>
    `;
  }

  // History Section
  if (selectedSections.includes('history') && candidate.history.length > 0) {
    content += `
      <div class="section">
        <h3 class="section-title">История взаимодействий</h3>
        <div class="timeline">
          ${candidate.history
            .map(
              (interaction) => `
            <div class="timeline-item">
              <div class="timeline-date">${new Date(interaction.date).toLocaleDateString('ru-RU', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}</div>
              <div class="timeline-content">
                <strong>${interaction.user}</strong>: ${interaction.details}
                ${
                  interaction.statusBefore && interaction.statusAfter
                    ? `<br><em>${interaction.statusBefore} → ${interaction.statusAfter}</em>`
                    : ''
                }
              </div>
            </div>
          `
            )
            .join('')}
        </div>
      </div>
    `;
  }

  // Verification Section
  if (selectedSections.includes('verification')) {
    content += `
      <div class="section">
        <h3 class="section-title">Дополнительная проверка</h3>
        <p>Информация о проверках и рекомендациях будет отображаться здесь</p>
      </div>
    `;
  }

  // Comments Section
  if (selectedSections.includes('comments')) {
    const comments = candidate.history.filter((h) => h.type === 'comment');
    if (comments.length > 0) {
      content += `
        <div class="section">
          <h3 class="section-title">Комментарии рекрутера</h3>
          ${comments
            .map(
              (comment) => `
            <div class="comment">
              <div class="comment-author">${comment.user}</div>
              <div class="comment-text">${comment.details}</div>
              <div class="comment-date">${new Date(comment.date).toLocaleDateString('ru-RU', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}</div>
            </div>
          `
            )
            .join('')}
        </div>
      `;
    }
  }

  const footer = `
    <div class="footer">
      <p>Карточка кандидата сгенерирована ${new Date().toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })}</p>
      <p>Сгенерировано через CRM систему подбора персонала</p>
    </div>
  `;

  return `
    <!DOCTYPE html>
    <html lang="ru">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${candidate.name} - Карточка кандидата</title>
      ${styles}
    </head>
    <body>
      ${header}
      ${content}
      ${footer}
    </body>
    </html>
  `;
}
