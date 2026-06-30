const state = {
  articles: [],
};

function summarize(text) {
  const normalized = text.replace(/\s+/g, ' ').trim();
  return normalized.length > 120 ? `${normalized.slice(0, 117)}...` : normalized;
}

function renderArticles(articles) {
  const list = document.getElementById('articleList');
  const count = document.getElementById('resultCount');

  if (!articles.length) {
    list.innerHTML = '<div class="empty">검색 결과가 없습니다.</div>';
    count.textContent = '결과 0건';
    return;
  }

  count.textContent = `결과 ${articles.length}건`;
  list.innerHTML = articles
    .map(
      (article) => `
        <article class="card">
          <div class="card__meta">${article.조}</div>
          <h2>${article.제목}</h2>
          <p>${summarize(article.본문)}</p>
        </article>
      `
    )
    .join('');
}

async function init() {
  const input = document.getElementById('searchInput');

  try {
    const response = await fetch('./조항데이터.json');
    if (!response.ok) {
      throw new Error('조항 데이터를 불러오지 못했습니다.');
    }

    state.articles = await response.json();
    renderArticles(state.articles);
  } catch (error) {
    document.getElementById('articleList').innerHTML = `<div class="empty">${error.message}</div>`;
    return;
  }

  input.addEventListener('input', () => {
    const keyword = input.value.trim().toLowerCase();
    const filtered = state.articles.filter((article) => {
      const searchable = `${article.조} ${article.제목} ${article.본문}`.toLowerCase();
      return searchable.includes(keyword);
    });
    renderArticles(filtered);
  });
}

document.addEventListener('DOMContentLoaded', init);
