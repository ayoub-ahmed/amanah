import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Banknote, Calculator, Gem, Landmark, Moon, ShieldCheck, Sparkles, Sun } from 'lucide-react';

type Language = 'en' | 'ar';
type Basis = 'gold' | 'silver';
type Currency = { code: string; symbol: string };

const currencies: Currency[] = [
  { code: 'LYD', symbol: 'د.ل' },
  { code: 'USD', symbol: '$' }, { code: 'GBP', symbol: '£' }, { code: 'EUR', symbol: '€' },
  { code: 'CAD', symbol: 'CA$' }, { code: 'AUD', symbol: 'A$' }, { code: 'AED', symbol: 'د.إ' },
  { code: 'SAR', symbol: 'ر.س' }, { code: 'PKR', symbol: '₨' }, { code: 'INR', symbol: '₹' },
];

const copy = {
  en: {
    pageTitle: 'Amanah | Zakat Calculator',
    metaDescription: 'Calculate your Zakat on eligible savings and precious metals in English or Arabic.',
    brand: 'Amanah', switchToDark: 'Switch to dark mode', switchToLight: 'Switch to light mode', eyebrow: 'A thoughtful guide to giving',
    title: 'Your Zakat, clearly understood.', intro: 'Bring your eligible savings and precious metals together. See whether they reach Nisab, and what 2.5% looks like for your household.',
    asideTitle: 'A personal calculation', aside: 'Enter the prices you want to use. Nothing is fetched or stored here except your language preference.',
    formTitle: 'Your yearly snapshot', formSubtitle: 'Use your current amounts and local market prices.', currencySection: 'Currency & market prices',
    currencyLabel: 'Calculation currency', currencyHelp: 'All amounts and gram prices use this currency.',
    goldPrice: 'Gold price per gram', silverPrice: 'Silver price per gram', priceHelp: 'Enter the price you wish to use. Prices are not live.',
    assetsSection: 'Eligible holdings', goldWeight: 'Gold you own', silverWeight: 'Silver you own',
    weightHelp: 'Weight in grams. Leave at 0 if none.', cash: 'Cash & savings', cashHelp: 'Include cash and accessible savings you consider Zakat-eligible.',
    nisabLabel: 'Nisab threshold', nisabBasis: 'Nisab basis', goldBasis: 'Gold · 85 g', silverBasis: 'Silver · 595 g',
    goldNisab: 'Based on 85 grams of gold', silverNisab: 'Based on 595 grams of silver', setPrice: 'Add a price per gram to calculate',
    yearQuestion: 'A lunar year has passed on these holdings', yearHelp: 'Zakat is due only when eligible holdings meet Nisab and a lunar year has passed.',
    calculate: 'Calculate my Zakat', resultKicker: 'Your calculation', resultTitle: 'A clear picture of your giving.',
    resultIntro: 'Enter your figures and calculate to see your Zakat summary here.', zakatDue: 'Zakat due', emptyAmount: '—',
    currencySuffix: 'in', holdings: 'Eligible holdings', nisabLine: 'Nisab threshold', rate: 'Zakat rate',
    emptyStatus: 'Your result will appear here after you calculate.', statusDue: 'Your eligible holdings meet Nisab and a lunar year has passed. Zakat at 2.5% is due.',
    statusNoYear: 'Your holdings meet Nisab, but you indicated that a lunar year has not yet passed. No Zakat is calculated yet.',
    statusBelow: 'Your eligible holdings are below the selected Nisab threshold. Zakat is not due based on these figures.',
    statusNeedPrice: 'Enter a price per gram for your selected Nisab basis to calculate your threshold.',
    disclaimerTitle: 'A note on your result',
    disclaimer: 'This tool offers a simple estimate based on the figures and Nisab basis you choose. Zakat rulings can vary, including which assets are eligible and how debts are treated. For guidance specific to your circumstances, consult a trusted scholar. Prices are entered by you and are not live.',
    errorInvalid: 'Please enter valid, non-negative numbers for prices, weights, and savings.',
    errorPrice: 'Enter a price per gram for the selected Nisab basis before calculating.',
    errorCurrency: 'Choose a currency for your calculation.',
    clear: 'Clear amounts', cleared: 'Amounts cleared. Enter your figures to begin again.',
    footer: 'A considered tool for a meaningful act.', localOnly: 'Your figures stay in this browser.',
    metalsHelp: 'Precious metals are valued using the prices you entered above.',
  },
  ar: {
    pageTitle: 'أمانة | حاسبة الزكاة',
    metaDescription: 'احسب زكاة المدخرات المؤهلة والمعادن النفيسة بالعربية أو الإنجليزية.',
    brand: 'أمانة', switchToDark: 'التبديل إلى الوضع الداكن', switchToLight: 'التبديل إلى الوضع الفاتح', eyebrow: 'دليل متأنٍ للعطاء',
    title: 'زكاتك، واضحة ومحسوبة.', intro: 'اجمع مدخراتك المؤهلة ومعادنك النفيسة. تعرّف على بلوغها النصاب ومقدار ٢٫٥٪ لأسرتك.',
    asideTitle: 'حساب شخصي', aside: 'أدخل الأسعار التي ترغب في اعتمادها. لا نجلب الأسعار أو نخزن بياناتك؛ الاستثناء الوحيد هو تفضيل اللغة.',
    formTitle: 'ملخص أموالك السنوي', formSubtitle: 'أدخل المبالغ الحالية وأسعار السوق المحلية.', currencySection: 'العملة وأسعار السوق',
    currencyLabel: 'عملة الحساب', currencyHelp: 'تُعرض جميع المبالغ وأسعار الغرام بهذه العملة.',
    goldPrice: 'سعر غرام الذهب', silverPrice: 'سعر غرام الفضة', priceHelp: 'أدخل السعر الذي تريد استخدامه. الأسعار لا تُحدَّث تلقائيًا.',
    assetsSection: 'الأموال المؤهلة للزكاة', goldWeight: 'وزن الذهب الذي تملكه', silverWeight: 'وزن الفضة التي تملكها',
    weightHelp: 'الوزن بالغرام. اترك القيمة ٠ إن لم يوجد.', cash: 'النقد والمدخرات', cashHelp: 'أدرج النقد والمدخرات المتاحة التي تعدّها مؤهلة للزكاة.',
    nisabLabel: 'حد النصاب', nisabBasis: 'أساس النصاب', goldBasis: 'الذهب · ٨٥ غ', silverBasis: 'الفضة · ٥٩٥ غ',
    goldNisab: 'على أساس ٨٥ غرامًا من الذهب', silverNisab: 'على أساس ٥٩٥ غرامًا من الفضة', setPrice: 'أدخل سعر الغرام لحساب النصاب',
    yearQuestion: 'مرّ حول قمري على هذه الأموال', yearHelp: 'تجب الزكاة عند بلوغ الأموال المؤهلة النصاب ومرور حول قمري.',
    calculate: 'احسب زكاتي', resultKicker: 'نتيجة حسابك', resultTitle: 'صورة واضحة لعطائك.',
    resultIntro: 'أدخل أرقامك واضغط احسب لعرض ملخص الزكاة هنا.', zakatDue: 'الزكاة المستحقة', emptyAmount: '—',
    currencySuffix: 'بعملة', holdings: 'الأموال المؤهلة', nisabLine: 'حد النصاب', rate: 'نسبة الزكاة',
    emptyStatus: 'ستظهر النتيجة هنا بعد إجراء الحساب.', statusDue: 'بلغت أموالك المؤهلة النصاب ومرّ عليها حول قمري. الزكاة المستحقة ٢٫٥٪.',
    statusNoYear: 'بلغت أموالك النصاب، لكنك أفدت بأن الحول القمري لم يمر بعد. لم تُحسب زكاة مستحقة.',
    statusBelow: 'الأموال المؤهلة أقل من حد النصاب المختار. لا تجب الزكاة وفق هذه الأرقام.',
    statusNeedPrice: 'أدخل سعر الغرام لأساس النصاب المحدد كي نحسب الحد.',
    disclaimerTitle: 'تنبيه بشأن النتيجة',
    disclaimer: 'تقدم هذه الأداة تقديرًا مبسطًا وفق الأرقام وأساس النصاب الذي تختاره. قد تختلف أحكام الزكاة، بما في ذلك الأموال المؤهلة وطريقة احتساب الديون. استشر عالمًا موثوقًا بما يناسب حالتك. الأسعار من إدخالك وليست مباشرة.',
    errorInvalid: 'يرجى إدخال أرقام صحيحة غير سالبة للأسعار والأوزان والمدخرات.',
    errorPrice: 'أدخل سعر الغرام لأساس النصاب المحدد قبل إجراء الحساب.',
    errorCurrency: 'اختر عملة لإجراء الحساب.',
    clear: 'مسح المبالغ', cleared: 'تم مسح المبالغ. أدخل أرقامك للبدء من جديد.',
    footer: 'أداة متأنية لفريضة ذات معنى.', localOnly: 'تبقى أرقامك في هذا المتصفح.',
    metalsHelp: 'تُقيّم المعادن النفيسة وفق الأسعار التي أدخلتها أعلاه.',
  },
} as const;

type Results = { holdings: number; nisab: number; due: number; eligible: boolean; yearPassed: boolean };

function App() {
  const [language, setLanguage] = useState<Language>(() => {
    try {
      return localStorage.getItem('amanah-language') === 'ar' ? 'ar' : 'en';
    } catch {
      return 'en';
    }
  });
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      return localStorage.getItem('amanah-theme') === 'dark' ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  });
  const [currency, setCurrency] = useState('LYD');
  const [goldPrice, setGoldPrice] = useState('');
  const [silverPrice, setSilverPrice] = useState('');
  const [goldWeight, setGoldWeight] = useState('');
  const [silverWeight, setSilverWeight] = useState('');
  const [cash, setCash] = useState('');
  const [basis, setBasis] = useState<Basis>('gold');
  const [yearPassed, setYearPassed] = useState(false);
  const [result, setResult] = useState<Results | null>(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const t = copy[language];
  const selectedCurrency = currencies.find((item) => item.code === currency) ?? currencies[0];
  const selectedPrice = basis === 'gold' ? goldPrice : silverPrice;
  const nisab = useMemo(() => Number(selectedPrice) * (basis === 'gold' ? 85 : 595), [selectedPrice, basis]);
  const formatter = useMemo(() => new Intl.NumberFormat(language === 'ar' ? 'ar' : 'en', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), [language]);
  const number = (value: number) => formatter.format(value);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.title = t.pageTitle;
    document.querySelector('meta[name="description"]')?.setAttribute('content', t.metaDescription);
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', t.pageTitle);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', t.metaDescription);
    document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', t.pageTitle);
    document.querySelector('meta[name="twitter:description"]')?.setAttribute('content', t.metaDescription);
    try {
      localStorage.setItem('amanah-language', language);
    } catch {
      // The calculator remains usable if browser storage is unavailable.
    }
  }, [language]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    try {
      localStorage.setItem('amanah-theme', theme);
    } catch {
      // The theme remains usable if browser storage is unavailable.
    }
  }, [theme]);

  const calculate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setNotice('');
    const raw = [goldPrice, silverPrice, goldWeight, silverWeight, cash];
    const values = raw.map((value) => value.trim() === '' ? 0 : Number(value));
    if (values.some((value) => !Number.isFinite(value) || value < 0)) {
      setError(t.errorInvalid);
      setResult(null);
      return;
    }
    if (!currency) {
      setError(t.errorCurrency);
      setResult(null);
      return;
    }
    if (selectedPrice.trim() === '' || !Number.isFinite(Number(selectedPrice)) || Number(selectedPrice) <= 0) {
      setError(t.errorPrice);
      setResult(null);
      return;
    }
    const holdings = values[0] * values[2] + values[1] * values[3] + values[4];
    const threshold = Number(selectedPrice) * (basis === 'gold' ? 85 : 595);
    const eligible = holdings >= threshold;
    setResult({ holdings, nisab: threshold, eligible, yearPassed, due: eligible && yearPassed ? holdings * 0.025 : 0 });
  };

  const clear = () => {
    setGoldPrice(''); setSilverPrice(''); setGoldWeight(''); setSilverWeight(''); setCash('');
    setYearPassed(false); setResult(null); setError(''); setNotice(t.cleared);
  };

  const status = !result
    ? t.emptyStatus
    : !result.eligible ? t.statusBelow
      : !result.yearPassed ? t.statusNoYear : t.statusDue;

  const gramUnit = language === 'ar' ? 'غ' : 'g';
  const amountField = (id: string, label: string, value: string, onChange: (value: string) => void, help: string, suffix?: string, placeholder = '0') => (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <div className="input-wrap">
        <input id={id} data-testid={`input-${id}`} type="number" inputMode="decimal" min="0" step="any" value={value} placeholder={placeholder} onChange={(event) => { onChange(event.target.value); setNotice(''); setError(''); setResult(null); }} aria-describedby={`${id}-help`} />
        {suffix && <span className="input-suffix">{suffix}</span>}
      </div>
      <span className="field-help" id={`${id}-help`}>{help}</span>
    </div>
  );

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand" aria-label={t.brand}>
          <span className="brand-mark"><Landmark aria-hidden="true" /></span>
          <span>{t.brand}</span>
        </div>
        <div className="header-actions">
          <button
            type="button"
            className="theme-toggle"
            aria-label={theme === 'dark' ? t.switchToLight : t.switchToDark}
            title={theme === 'dark' ? t.switchToLight : t.switchToDark}
            aria-pressed={theme === 'dark'}
            onClick={() => setTheme((current) => current === 'dark' ? 'light' : 'dark')}
            data-testid="button-theme-toggle"
          >
            {theme === 'dark' ? <Moon aria-hidden="true" /> : <Sun aria-hidden="true" />}
          </button>
          <div className="language-toggle" aria-label={language === 'en' ? 'Language' : 'اللغة'}>
            <button type="button" className={language === 'ar' ? 'active' : ''} aria-pressed={language === 'ar'} onClick={() => setLanguage('ar')} data-testid="button-language-ar">العربية</button>
            <button type="button" className={language === 'en' ? 'active' : ''} aria-pressed={language === 'en'} onClick={() => setLanguage('en')} data-testid="button-language-en">English</button>
          </div>
        </div>
      </header>

      <main className="page-wrap">
        <section className="intro">
          <div>
            <div className="eyebrow">{t.eyebrow}</div>
            <h1>{t.title}</h1>
            <p>{t.intro}</p>
          </div>
          <aside className="intro-aside">
            <strong>{t.asideTitle}</strong>
            {t.aside}
          </aside>
        </section>

        <div className="calculator-grid">
          <form className="panel form-panel" onSubmit={calculate} noValidate>
            <div className="panel-heading">
              <div><h2>{t.formTitle}</h2><p>{t.formSubtitle}</p></div>
              <span className="step-mark" aria-hidden="true">01</span>
            </div>

            <section className="section-block" aria-labelledby="currency-heading">
              <h3 className="section-title" id="currency-heading"><Banknote aria-hidden="true" />{t.currencySection}</h3>
              <div className="currency-row">
                <div className="field">
                  <label htmlFor="currency">{t.currencyLabel}</label>
                  <select id="currency" data-testid="select-currency" className="select-control" value={currency} onChange={(event) => { setCurrency(event.target.value); setResult(null); }} aria-describedby="currency-help">
                    {currencies.map((item) => <option key={item.code} value={item.code}>{item.code} · {item.symbol}</option>)}
                  </select>
                  <span className="field-help" id="currency-help">{t.currencyHelp}</span>
                </div>
                {amountField('gold-price', t.goldPrice, goldPrice, setGoldPrice, t.priceHelp, `${selectedCurrency.symbol}/${gramUnit}`)}
              </div>
              <div className="field-grid">
                {amountField('silver-price', t.silverPrice, silverPrice, setSilverPrice, t.priceHelp, `${selectedCurrency.symbol}/${gramUnit}`)}
                <div className="field"><span className="field-label">{t.nisabBasis}</span>
                  <div className="basis-toggle" role="group" aria-label={t.nisabBasis}>
                    <button type="button" className={basis === 'gold' ? 'active' : ''} aria-pressed={basis === 'gold'} onClick={() => { setBasis('gold'); setResult(null); }} data-testid="button-basis-gold">{t.goldBasis}</button>
                    <button type="button" className={basis === 'silver' ? 'active' : ''} aria-pressed={basis === 'silver'} onClick={() => { setBasis('silver'); setResult(null); }} data-testid="button-basis-silver">{t.silverBasis}</button>
                  </div>
                  <span className="field-help">{basis === 'gold' ? t.goldNisab : t.silverNisab}</span>
                </div>
              </div>
            </section>

            <section className="section-block" aria-labelledby="holdings-heading">
              <h3 className="section-title" id="holdings-heading"><Gem aria-hidden="true" />{t.assetsSection}</h3>
              <div className="field-grid">
                {amountField('gold-weight', t.goldWeight, goldWeight, setGoldWeight, t.weightHelp, gramUnit)}
                {amountField('silver-weight', t.silverWeight, silverWeight, setSilverWeight, t.weightHelp, gramUnit)}
              </div>
              <div style={{ marginTop: 14 }}>
                {amountField('cash-savings', t.cash, cash, setCash, t.cashHelp, selectedCurrency.symbol)}
              </div>
              <div className="field-help" style={{ marginTop: 10 }}>{t.metalsHelp}</div>
            </section>

            <div className="nisab-card" aria-live="polite" data-testid="text-nisab-threshold">
              <div>
                <div className="nisab-title">{t.nisabLabel}</div>
                <div className="nisab-subtitle">{basis === 'gold' ? t.goldNisab : t.silverNisab}</div>
              </div>
              <div className="nisab-value">{Number(selectedPrice) > 0 ? `${selectedCurrency.symbol}${number(nisab)}` : t.setPrice}</div>
            </div>

            <label className="year-check">
              <input type="checkbox" checked={yearPassed} onChange={(event) => { setYearPassed(event.target.checked); setResult(null); }} data-testid="input-lunar-year" />
              <span>{t.yearQuestion}<small>{t.yearHelp}</small></span>
            </label>

            <button type="submit" className="calculate-btn" data-testid="button-calculate">
              <Calculator aria-hidden="true" />{t.calculate}
            </button>
            <button type="button" className="clear-button" onClick={clear} data-testid="button-clear">{t.clear}</button>
            {error && <div className="error-box" role="alert" data-testid="status-calculation-error">{error}</div>}
            {notice && <div className="notice-box" role="status" data-testid="status-calculation-notice">{notice}</div>}
          </form>

          <section className="panel result-panel" aria-labelledby="result-heading" aria-live="polite" data-testid="card-calculation-result">
            <div className="result-head">
              <div className="result-kicker"><Sparkles aria-hidden="true" />{t.resultKicker}</div>
              <h2 id="result-heading">{t.resultTitle}</h2>
              <p>{t.resultIntro}</p>
            </div>
            <div className="result-content">
              <div className="result-label">{t.zakatDue}</div>
              <div className="result-amount" data-testid="text-zakat-due">{result ? `${selectedCurrency.symbol}${number(result.due)}` : t.emptyAmount}</div>
              <div className="result-currency">{t.currencySuffix} {currency}</div>
              <div className="result-rule" />
              <div className="summary-line"><span>{t.holdings}</span><strong data-testid="text-eligible-holdings">{result ? `${selectedCurrency.symbol}${number(result.holdings)}` : '—'}</strong></div>
              <div className="summary-line"><span>{t.nisabLine}</span><strong data-testid="text-result-nisab">{result ? `${selectedCurrency.symbol}${number(result.nisab)}` : (Number(selectedPrice) > 0 ? `${selectedCurrency.symbol}${number(nisab)}` : '—')}</strong></div>
              <div className="summary-line"><span>{t.rate}</span><strong>2.5%</strong></div>
              <div className={`result-status${result?.eligible && result.yearPassed ? ' eligible' : ''}`}>
                <span className="status-dot" aria-hidden="true" />
                <span>{result ? status : (Number(selectedPrice) > 0 ? t.emptyStatus : t.statusNeedPrice)}</span>
              </div>
            </div>
          </section>
        </div>

        <aside className="disclaimer">
          <ShieldCheck aria-hidden="true" />
          <div><strong>{t.disclaimerTitle}</strong>{t.disclaimer}</div>
        </aside>
      </main>

      <footer className="footer">
        <span className="footer-mark">{t.footer}</span>
        <span>{t.localOnly}</span>
      </footer>
    </div>
  );
}

export default App;