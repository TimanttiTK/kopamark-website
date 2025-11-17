function calculatePrice() {
    const area = parseFloat(document.getElementById('area').value) || 0;
    const location = document.getElementById('location').value || 'helsinki';
    const freq = parseInt(document.getElementById('freq').value) || 1;
    const wcRange = document.getElementById('wc').value;

    if (area <= 0 || freq < 1 || freq > 5 || !wcRange || !location) {
        document.getElementById('result').innerHTML = 'Anna kelvolliset arvot!';
        return;
    }

    // WC keskiarvo haarukasta
    let wcAvg;
    switch (wcRange) {
        case '0-5': wcAvg = 2.5; break;
        case '6-10': wcAvg = 8; break;
        case '11-15': wcAvg = 13; break;
        case '15+': wcAvg = 17; break;
        default: wcAvg = 0;
    }

    // Sijainti-kerroin
    let locationMultiplier = 1;  // Helsinki default
    if (location === 'espoo') locationMultiplier = 1.1;
    if (location === 'vantaa') locationMultiplier = 1.2;

    // Aika/viikko: Optimistinen (200 m²/h) vs varovainen (150 m²/h), + WC (0.15 h/kpl avg)
    const timePerWeekOpt = (area / 200) + (wcAvg * 0.1) * freq;
    const timePerWeekVar = (area / 150) + (wcAvg * 0.2) * freq;

    const hourlyRate = 35;  // €/h alv 0%
    let weeklyPriceOpt = timePerWeekOpt * hourlyRate * locationMultiplier;
    let weeklyPriceVar = timePerWeekVar * hourlyRate * locationMultiplier;

    let monthlyPriceLow = weeklyPriceOpt * 4.33;  // Kuukausi ~4.33 viikkoa
    let monthlyPriceHigh = weeklyPriceVar * 4.33;

    // Marginaali kiinteisiin (matkat, yms.): 10-20% koosta riippuen
    const margin = (area < 500) ? 1.1 : 1.15;
    monthlyPriceLow = Math.round(monthlyPriceLow * margin);
    monthlyPriceHigh = Math.round(monthlyPriceHigh * margin + 100);  // + buffer varovaiseen

    const resultText = `${monthlyPriceLow}–${monthlyPriceHigh}`;

    // Unicode-safe base64 encoding (käytä TextEncoder Uint8Array:llä)
    const encoder = new TextEncoder();
    const data = encoder.encode(resultText);
    const base64 = btoa(String.fromCharCode(...data));

    // Avaa yhteystiedot.html params:illa
    const url = `yhteystiedot.html?low=${monthlyPriceLow}&high=${monthlyPriceHigh}&text=${base64}`;
    window.open(url, '_blank');
}

function toggleMenu() {
    document.body.classList.toggle("mobile-menu-open");
}

