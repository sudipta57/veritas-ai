"""Report generator agent implementation."""

from __future__ import annotations

from uuid import uuid4

from models.schemas import AccuracyReport, ClaimVerdict, VerdictType


class ReportGeneratorAgent:
	"""Aggregate claim verdicts into a final accuracy report."""

	_VERDICT_SCORES = {
		VerdictType.TRUE: 100,
		VerdictType.PARTIALLY_TRUE: 50,
		VerdictType.CONFLICTING: 40,
		VerdictType.UNVERIFIABLE: 20,
		VerdictType.FALSE: 0,
	}

	def generate(
		self,
		verdicts: list[ClaimVerdict],
		processing_time: float,
		ai_text_score: int = None,
	) -> AccuracyReport:
		"""Build a complete AccuracyReport from claim-level verdicts."""
		report_id = str(uuid4())

		verdict_breakdown = {verdict.value: 0 for verdict in VerdictType}
		weighted_scores: list[float] = []

		for verdict in verdicts:
			verdict_breakdown[verdict.verdict.value] = verdict_breakdown.get(verdict.verdict.value, 0) + 1
			base_score = self._VERDICT_SCORES.get(verdict.verdict, 0)
			weighted_scores.append(base_score * (verdict.confidence / 100.0))

		overall_score = 0
		if weighted_scores:
			overall_score = int(round(sum(weighted_scores) / len(weighted_scores)))

		return AccuracyReport(
			report_id=report_id,
			overall_score=overall_score,
			total_claims=len(verdicts),
			verdict_breakdown=verdict_breakdown,
			claims=verdicts,
			ai_text_score=ai_text_score,
			processing_time_seconds=processing_time,
		)
