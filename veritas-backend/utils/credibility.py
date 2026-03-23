"""Credibility scoring utilities."""

from urllib.parse import urlparse

from models.schemas import CredibilityTier


ACADEMIC_DOMAINS = {
	"nature.com",
	"pubmed.ncbi.nlm.nih.gov",
	"scholar.google.com",
	"arxiv.org",
	"jstor.org",
}

ESTABLISHED_NEWS_DOMAINS = {
	"reuters.com",
	"apnews.com",
	"bbc.com",
	"bbc.co.uk",
	"nytimes.com",
	"theguardian.com",
	"washingtonpost.com",
	"bloomberg.com",
	"economist.com",
	"ft.com",
	"wsj.com",
	"npr.org",
	"pbs.org",
	"abc.net.au",
	"cbc.ca",
	"aljazeera.com",
	"thehindu.com",
}

BLACKLISTED_DOMAINS = [
	"theonion.com",
	"babylonbee.com",
	"clickhole.com",
	"worldnewsdailyreport.com",
	"empirenews.net",
]


def _get_domain(url: str) -> str:
	parsed = urlparse(url)
	domain = parsed.netloc or parsed.path
	if domain.startswith("www."):
		domain = domain[4:]
	return domain.lower().strip()


def _domain_matches(domain: str, candidates: set[str] | list[str]) -> bool:
	return any(domain == candidate or domain.endswith(f".{candidate}") for candidate in candidates)


def score_credibility(url: str) -> CredibilityTier:
	domain = _get_domain(url)

	if _domain_matches(domain, BLACKLISTED_DOMAINS):
		return None

	if domain.endswith(".gov") or domain.endswith(".edu") or _domain_matches(domain, ACADEMIC_DOMAINS):
		return CredibilityTier.TIER1

	if _domain_matches(domain, ESTABLISHED_NEWS_DOMAINS):
		return CredibilityTier.TIER2

	return CredibilityTier.TIER3
