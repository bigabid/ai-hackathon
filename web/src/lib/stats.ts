// Chi-square test of independence for 2 x k table (likes vs not-likes across variants)
// Returns { chi2, df, critical, significant }

const CHI2_CRITICAL_0_95: Record<number, number> = {
  1: 3.841,
  2: 5.991,
  3: 7.815,
  4: 9.488,
  5: 11.070,
  6: 12.592,
  7: 14.067,
  8: 15.507,
  9: 16.919,
  10: 18.307,
};

export function chiSquareLikesVsNotLikes(likes: number[], totals: number[]) {
  const k = likes.length;
  const df = Math.max(1, k - 1);
  const totalAll = totals.reduce((a, b) => a + b, 0);
  const totalLikes = likes.reduce((a, b) => a + b, 0);
  const totalNotLikes = totalAll - totalLikes;
  if (totalAll === 0) return { chi2: 0, df, critical: CHI2_CRITICAL_0_95[df] || 18.307, significant: false };

  let chi2 = 0;
  for (let i = 0; i < k; i++) {
    const expectedLikes = (totals[i] * totalLikes) / totalAll;
    const expectedNotLikes = (totals[i] * totalNotLikes) / totalAll;
    const notLikes = totals[i] - likes[i];

    const dLike = likes[i] - expectedLikes;
    const dNotLike = notLikes - expectedNotLikes;

    if (expectedLikes > 0) chi2 += (dLike * dLike) / expectedLikes;
    if (expectedNotLikes > 0) chi2 += (dNotLike * dNotLike) / expectedNotLikes;
  }
  const critical = CHI2_CRITICAL_0_95[df] || 18.307; // fallback for larger k
  return { chi2, df, critical, significant: chi2 >= critical };
}


