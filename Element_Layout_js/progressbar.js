const kelvinInput = document.getElementById("kelvinInput");
const fahrenheitInput = document.getElementById("fahrenheitInput");
const celsiusInput = document.getElementById("celsiusInput");

// 선택점의 초기 위치 (시각적 수치)
// let visualPosition = 48; // 초기 위치를 50으로 설정
updateSelector(visualPosition);

// 실제 수치와 시각적 수치를 매핑하기 위한 함수
function mapVisualToReal(visualPosition) {
    // 시각적 수치(4~96)를 실제 수치(0~6000)로 변환
    return (visualPosition - 4) * (6000 / 92);
}

// 선택점의 위치와 색상 업데이트.
function updateSelector(visualPosition) {
    const realPosition = mapVisualToReal(visualPosition);
    graphSelector.style.left = `calc(${visualPosition}% - 10px)`;

    const color = calculateGradientColor(visualPosition);
    graphBar.style.backgroundColor = color;
    updateElementColors(color);
    numericValue.textContent = Math.round(realPosition); // 실제 수치 표시
}

const minPosition = 0;
const maxPosition = 6000;
const selectorWidth = 0; // 셀렉터의 너비

graphBar.addEventListener("mousedown", (e) => {
    isDragging = true;
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
});

function onMouseMove(e) {
    if (!isDragging) return;

    const rect = graphBar.getBoundingClientRect();
    let newPosition = ((e.clientX - rect.left) / rect.width) * 6000;

    // 위치가 최소값 및 최대값 내에 유지.
    if (newPosition < minPosition) {
        newPosition = minPosition;
    } else if (newPosition > maxPosition) {
        newPosition = maxPosition;
    }

    // 셀렉터가 가려지지 않도록 조정.
    if (newPosition < selectorWidth / 2) {
        newPosition = selectorWidth / 2;
    } else if (newPosition > 6000 - selectorWidth / 2) {
        newPosition = 6000 - selectorWidth / 2;
    }

    visualPosition = mapRealToVisual(newPosition); // 시각적 수치 업데이트
    updateSelector(visualPosition);

    // 실제 수치를 계산하고 업데이트합니다.
    const kelvinValue = convertToKelvin(newPosition, 'kelvin'); // 수정된 부분
    updateTemperature(kelvinValue, 'kelvin');

    // 켈빈 입력란에 있는 값을 그래프 바의 위치에 따라 실시간으로 업데이트
    kelvinInput.value = kelvinValue; // 추가된 부분
}

function onMouseUp() {
    isDragging = false;
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
}

// 켈빈, 섭씨, 화씨로 변환하는 함수
function convertToKelvin(value, unit) {
    if (unit === 'fahrenheit') {
        // 화씨를 켈빈으로 변환
        return (value - 32) * 5/9 + 273.15;
    } else if (unit === 'celsius') {
        // 섭씨를 켈빈으로 변환
        return value + 273.15;
    } else if (unit === 'kelvin') {
        // 이미 켈빈인 경우 그대로 반환
        return value;
    } else {
        // 그 외의 경우 기본은 켈빈으로 유지
        console.error(`지원하지 않는 단위: ${unit}. 기본값은 켈빈(K)으로 지정됨.`);
        return value;
    }
}

function syncGraphBarWithTemperature() {
    const kelvinValue = parseFloat(kelvinInput.value);
    // graphBar.value = mapRealToVisual(kelvinValue);
    updateTemperature(kelvinValue, 'kelvin');
}

function syncTemperatureWithGraphBar() {
    const visualPosition = parseFloat(graphBar.value);
    const kelvinValue = convertToKelvin(mapVisualToReal(visualPosition), 'celsius');
    kelvinInput.value = kelvinValue;
    updateTemperature(kelvinValue, 'kelvin');
}

// 그래프바를 켈빈값으로 초기화
graphBar.value = mapRealToVisual(273); // 273K = 0%

// 초기 온도 설정 (켈빈)
updateTemperature(273, 'kelvin');


// 그라데이션 색상 계산 함수
function calculateGradientColor(position) {
  const red = Math.round(255 - (position * 255) / 100);
  const blue = Math.round((position * 255) / 100);
  return `rgb(${blue}, 0, ${red})`;
}

// 시각적 수치(0~100)를 실제 수치(0~6,000)로 변환하는 함수
function mapVisualToReal(visualPosition) {
    return (visualPosition / 100) * 6000;
}

// 실제 수치(0~6,000)를 시각적 수치(0~100)로 변환하는 함수
function mapRealToVisual(realPosition) {
    return (realPosition / 6000) * 100;
}

// 섭씨->화씨
function convertCelsiusToFahrenheit(celsiusValue) {
    return (celsiusValue * 9/5) + 32;
}

// 화씨->섭씨
function convertFahrenheitToCelsius(fahrenheitValue) {
    return (fahrenheitValue - 32) * 5/9;
}

// 켈빈->화씨
function convertToFahrenheit(kelvinValue) {
    return (kelvinValue - 273.15) * 9/5 + 32;
}

// 켈빈->섭씨
function convertToCelsius(kelvinValue) {
    return kelvinValue - 273.15;
}

// 화씨->켈빈
function convertFahrenheitToKelvin(fahrenheitValue) {
    return (fahrenheitValue - 32) * 5/9 + 273.15;
}

// 섭씨->켈빈
function convertCelsiusToKelvin(celsiusValue) {
    return celsiusValue + 273.15;
}

// 켈빈 값을 이용해 온도를 업데이트하는 함수
function updateTemperature(value, unit) {
    if (unit === 'kelvin') {
        fahrenheitInput.value = convertToFahrenheit(value);
        celsiusInput.value = convertToCelsius(value);
    } else if (unit === 'fahrenheit') {
        celsiusInput.value = convertFahrenheitToCelsius(value);
        kelvinInput.value = convertFahrenheitToKelvin(value);
    } else if (unit === 'celsius') {
        fahrenheitInput.value = convertCelsiusToFahrenheit(value);
        kelvinInput.value = convertCelsiusToKelvin(value);
    } else {
        console.error(`지원하지 않는 단위: ${unit}. 기본값은 켈빈(K)으로 지정됨.`);
    }

    graphBar.value = mapRealToVisual(value); // 그래프바 업데이트
    updateSelector(mapRealToVisual(value)); // 시각적 수치 업데이트

}

// 온도 입력란 변경 이벤트 처리
kelvinInput.addEventListener('input', function() {
    updateTemperature(parseFloat(this.value), 'kelvin');
});

fahrenheitInput.addEventListener('input', function() {
    updateTemperature(parseFloat(this.value), 'fahrenheit');
});

celsiusInput.addEventListener('input', function() {
    updateTemperature(parseFloat(this.value), 'celsius');
});
