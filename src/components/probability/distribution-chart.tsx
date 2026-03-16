'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { RpgCard } from '@/components/shared/rpg-card';

const ResponsiveContainer = dynamic(
  () => import('recharts').then((mod) => mod.ResponsiveContainer),
  { ssr: false },
);
const AreaChart = dynamic(
  () => import('recharts').then((mod) => mod.AreaChart),
  { ssr: false },
);
const Area = dynamic(
  () => import('recharts').then((mod) => mod.Area),
  { ssr: false },
);
const XAxis = dynamic(
  () => import('recharts').then((mod) => mod.XAxis),
  { ssr: false },
);
const YAxis = dynamic(
  () => import('recharts').then((mod) => mod.YAxis),
  { ssr: false },
);
const Tooltip = dynamic(
  () => import('recharts').then((mod) => mod.Tooltip),
  { ssr: false },
);
const CartesianGrid = dynamic(
  () => import('recharts').then((mod) => mod.CartesianGrid),
  { ssr: false },
);

interface DistributionChartProps {
  primaryData: Array<{ value: number; probability: number }>;
  comparisonData?: Array<{ value: number; probability: number }>;
  primaryLabel: string;
  comparisonLabel?: string;
  totalCombinations: number;
  comparisonTotalCombinations?: number;
}

export function DistributionChart({
  primaryData,
  comparisonData,
  primaryLabel,
  comparisonLabel,
  totalCombinations,
  comparisonTotalCombinations,
}: DistributionChartProps) {
  // Merge data into a single array keyed by value
  const allValues = new Set<number>();
  primaryData.forEach((d) => allValues.add(d.value));
  comparisonData?.forEach((d) => allValues.add(d.value));

  const primaryMap = new Map(primaryData.map((d) => [d.value, d.probability]));
  const comparisonMap = comparisonData
    ? new Map(comparisonData.map((d) => [d.value, d.probability]))
    : null;

  const chartData = Array.from(allValues)
    .sort((a, b) => a - b)
    .map((value) => ({
      value,
      primary: (primaryMap.get(value) ?? 0) * 100,
      comparison: comparisonMap ? (comparisonMap.get(value) ?? 0) * 100 : undefined,
    }));

  return (
    <RpgCard variant="default" className="overflow-hidden border-white/10 bg-[linear-gradient(180deg,rgba(14,18,28,0.96),rgba(10,13,19,0.98))]">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
            <Image src="/images/icons/fantasy/pie-chart.png" alt="" fill className="object-contain p-2.5 opacity-95" />
          </div>
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
              Probability Curve
            </p>
            <h3 className="mt-1 text-lg font-semibold text-[var(--color-text-primary)]">
              Outcome Distribution
            </h3>
            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
              Each peak reflects how often a total appears across the full combinatorial space.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-black/20 px-3 py-1.5 text-[var(--color-text-secondary)]">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: 'var(--color-accent)' }} />
            {primaryLabel}
          </span>
          {comparisonLabel && (
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/8 px-3 py-1.5 text-amber-300">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
              {comparisonLabel}
            </span>
          )}
        </div>
      </div>

      <div style={{ width: '100%', height: 380 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="primaryGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-accent)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--color-accent)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="comparisonGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis
              dataKey="value"
              stroke="rgba(255,255,255,0.3)"
              tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.5)' }}
              tickLine={false}
            />
            <YAxis
              stroke="rgba(255,255,255,0.3)"
              tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.5)' }}
              tickLine={false}
              tickFormatter={(v: number) => `${v.toFixed(1)}%`}
              label={{
                value: 'Probability %',
                angle: -90,
                position: 'insideLeft',
                style: { fill: 'rgba(255,255,255,0.4)', fontSize: 11 },
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 8,
                fontSize: 12,
              }}
              formatter={(val: unknown, name: unknown) => {
                const numVal = Number(val);
                const label = name === 'primary' ? primaryLabel : comparisonLabel;
                return [`${numVal.toFixed(2)}%`, label];
              }}
              labelFormatter={(label: unknown) => {
                const numLabel = Number(label);
                const p = primaryMap.get(numLabel);
                const combos = p ? Math.round(p * totalCombinations) : 0;
                return `Result: ${numLabel}  (${combos}/${totalCombinations} combinations)`;
              }}
            />
            <Area
              type="monotone"
              dataKey="primary"
              name="primary"
              stroke="var(--color-accent)"
              fill="url(#primaryGradient)"
              strokeWidth={2}
              isAnimationActive={true}
              animationDuration={600}
            />
            {comparisonData && (
              <Area
                type="monotone"
                dataKey="comparison"
                name="comparison"
                stroke="#f59e0b"
                fill="url(#comparisonGradient)"
                strokeWidth={2}
                strokeDasharray="5 5"
                isAnimationActive={true}
                animationDuration={600}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </RpgCard>
  );
}
