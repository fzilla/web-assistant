
const SearchProviders = {
    google: {
        search: 'https://www.google.com/search?q={q}&ie=utf-8&oe=utf-8',
        suggestion: 'http://suggestqueries.google.com/complete/search?&q={q}'
    },
    bing: {
        search: 'https://www.bing.com/search?q={q}',
        suggestion: 'http://api.bing.com/osjson.aspx?query={q}'
    },
    yahoo: {
        search: 'https://search.yahoo.com/search?p={q}',
        suggestion: 'http://ff.search.yahoo.com/gossip?output=fxjson&command={q}'
    },
    youtube: {
        search: 'https://www.youtube.com/results?search_query={q}'
    },
    yandex: {
        search: 'https://yandex.com/search/?text={q}'
    },
    duckduckgo: {
        search: 'https://duckduckgo.com/?q={q}&t=ffab&atb=v100-4'
    },
    wikipedia: {
        search: 'https://en.wikipedia.org/wiki/Special:Search?search={q}',
        suggestion: 'http://en.wikipedia.org/w/api.php?action=opensearch&search={q}'
    },
    stackoverflow: {
        search: 'https://stackoverflow.com/search?q={q}'
    },
    flipkart: {
        search: 'https://www.flipkart.com/search?q={q}'
    },
    amazon: {
        search: 'https://www.amazon.com/exec/obidos/external-search/?field-keywords={q}&ie=UTF-8&mode=blended',
        suggestion: 'http://completion.amazon.com/search/complete?search-alias=aps&client=amazon-search-ui&mkt=1&q={q}'
    }
};

function getSearchUrl(provider, query) {
	return encodeURI(SearchProviders[provider]['search'].replace('{q}', query))
}

export default SearchProviders;

export { getSearchUrl };
