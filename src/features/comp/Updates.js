import { useEffect, useState } from 'react';

const Update = () => {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('general');

  useEffect(() => {
    const fetchNews = async () => {
      try {
// In your Update component's fetch call
const response = await fetch(`http://localhost:5000/api/news?category=${selectedCategory}`);        if (!response.ok) throw new Error('Failed to fetch news');
        const data = await response.json();
        setArticles(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, [selectedCategory]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-slate-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-sky-400 to-emerald-400 bg-clip-text text-transparent">
            Latest News
          </h1>
          
          {/* Category Filters */}
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            {['general', 'business', 'technology', 'sports', 'entertainment'].map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-sky-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </header>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-slate-800 rounded-lg p-6 animate-pulse">
                <div className="h-48 bg-slate-700 rounded-lg mb-4" />
                <div className="h-4 bg-slate-700 rounded w-3/4 mb-3" />
                <div className="h-4 bg-slate-700 rounded w-full mb-3" />
                <div className="h-4 bg-slate-700 rounded w-1/2" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="text-2xl text-rose-400 mb-4">⚠️ {error}</div>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* News Grid */}
        {!isLoading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <article
                key={article.url}
                className="bg-slate-800 rounded-xl p-6 hover:bg-slate-750 transition-all duration-300 group"
              >
                <div className="relative aspect-video rounded-lg overflow-hidden mb-4">
                  <img
                    src={article.urlToImage || '/placeholder-news.jpg'}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = '/placeholder-news.jpg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80" />
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between text-sm text-slate-400">
                    <span className="px-3 py-1 bg-slate-700 rounded-full">
                      {article.source?.name}
                    </span>
                    <time dateTime={article.publishedAt}>
                      {new Date(article.publishedAt).toLocaleDateString()}
                    </time>
                  </div>

                  <h2 className="text-xl font-semibold line-clamp-2">
                    {article.title}
                  </h2>

                  <p className="text-slate-300 line-clamp-3">
                    {article.description}
                  </p>

                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 text-sky-400 hover:text-sky-300 transition-colors"
                  >
                    Read More
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );  
};

export default Update;

