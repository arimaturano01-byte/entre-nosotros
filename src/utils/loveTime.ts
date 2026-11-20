export interface LoveDuration {
  totalDays: number;
  years: number;
  months: number;
  days: number;
  formattedYears: string;
  formattedStartDate: string;
  nextMilestoneTitle: string;
  nextMilestoneSubtitle: string;
  daysToMilestone: number;
  milestoneDateLabel: string;
}

const MONTHS_ES = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

const MONTHS_SHORT_ES = [
  'Ene',
  'Feb',
  'Mar',
  'Abr',
  'May',
  'Jun',
  'Jul',
  'Ago',
  'Sep',
  'Oct',
  'Nov',
  'Dic',
];

export function formatShortDateEs(isoDate: string): string {
  const parts = isoDate.split('-');
  if (parts.length !== 3) return isoDate;
  const year = parts[0];
  const monthIdx = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  const monthShort = MONTHS_SHORT_ES[monthIdx] || parts[1];
  return `${day} ${monthShort} ${year}`;
}

export function formatLongDateEs(isoDate: string): string {
  const parts = isoDate.split('-');
  if (parts.length !== 3) return isoDate;
  const year = parts[0];
  const monthIdx = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  const monthLong = MONTHS_ES[monthIdx] || parts[1];
  return `${day} de ${monthLong} de ${year}`;
}

export function getTodayHeaderEs(): string {
  const now = new Date();
  const weekdays = [
    'Domingo',
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
  ];
  return `${weekdays[now.getDay()]}, ${now.getDate()} de ${MONTHS_ES[now.getMonth()]}`;
}

export function calculateLoveDuration(startDateStr: string): LoveDuration {
  const parts = startDateStr.split('-').map((n) => parseInt(n, 10));
  const start =
    parts.length === 3
      ? new Date(parts[0], parts[1] - 1, parts[2])
      : new Date(2022, 1, 14);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const diffMs = Math.max(0, today.getTime() - start.getTime());
  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;

  let years = today.getFullYear() - start.getFullYear();
  let months = today.getMonth() - start.getMonth();
  let days = today.getDate() - start.getDate();

  if (days < 0) {
    months -= 1;
    const prevMonthLastDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      0
    ).getDate();
    days += prevMonthLastDay;
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  years = Math.max(0, years);
  months = Math.max(0, months);
  days = Math.max(0, days);

  const yearPart =
    years === 1 ? '1 año' : years > 1 ? `${years} años` : '';
  const monthPart =
    months === 1 ? '1 mes' : months > 1 ? `${months} meses` : '';
  const dayPart = days === 1 ? '1 día' : `${days} días`;

  const pieces = [yearPart, monthPart].filter(Boolean);
  const formattedYears =
    pieces.length > 0 ? `${pieces.join(', ')} y ${dayPart}` : dayPart;

  // Next round-thousand milestone
  const nextThousand = Math.ceil(totalDays / 1000) * 1000;
  const targetDays = nextThousand <= totalDays ? nextThousand + 1000 : nextThousand;
  const daysToThousand = targetDays - totalDays;
  const milestoneDate = new Date(start.getTime());
  milestoneDate.setDate(start.getDate() + targetDays - 1);

  const formattedThousand = targetDays.toLocaleString('es-ES');

  return {
    totalDays,
    years,
    months,
    days,
    formattedYears,
    formattedStartDate: formatLongDateEs(startDateStr),
    nextMilestoneTitle: `${formattedThousand} días juntos`,
    nextMilestoneSubtitle: 'Celebraremos nuestro mini aniversario',
    daysToMilestone: daysToThousand,
    milestoneDateLabel: `${milestoneDate.getDate()} de ${MONTHS_ES[milestoneDate.getMonth()]}`,
  };
}
