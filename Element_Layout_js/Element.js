const graphBar = document.getElementById("graphBar");
const graphSelector = document.getElementById("graphSelector");
const numericValue = document.getElementById("numericValue");

const colorred = "#e74c3c";
const coloryellow = "#f1c40f";
const colorgreed = "#27ae60";

// 선택점의 초기 위치 (시각적 수치)
let visualPosition = 50; // 초기 위치를 50으로 설정
updateSelector(visualPosition);

// 실제 수치와 시각적 수치를 매핑하기 위한 함수
function mapVisualToReal(visualPosition) {
    // 시각적 수치(4~96)를 실제 수치(0~100)로 변환
    return (visualPosition - 2) * (100 / 92);
}

// 선택점의 위치와 색상을 업데이트합니다.
function updateSelector(visualPosition) {
    const realPosition = mapVisualToReal(visualPosition);
    graphSelector.style.left = `calc(${visualPosition}% - 10px)`;

    const color = calculateGradientColor(visualPosition);
    graphBar.style.backgroundColor = color;
    updateElementColors(color);
}

// 그래프 바에서 마우스 드래그 이벤트를 수신합니다.
let isDragging = false;

graphBar.addEventListener("mousedown", (e) => {
    isDragging = true;

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
});

function onMouseMove(e) {
    if (!isDragging) return;

    const rect = graphBar.getBoundingClientRect();
    let newPosition = ((e.clientX - rect.left) / rect.width) * 100;

    // 위치가 그래프 내에 유지되도록 합니다.
    if (newPosition < 2) {
        newPosition = 2;
    } else if (newPosition > 94) {
        newPosition = 94;
    }

    visualPosition = newPosition; // 시각적 수치 업데이트
    updateSelector(visualPosition);
}

function onMouseUp() {
    isDragging = false;
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
}

function updateElementColors(color) {
  const elements = document.querySelectorAll(".element");
  elements.forEach((element) => {
    element.style.backgroundColor = color;
  });
}

// 그라데이션 색상 계산 함수
function calculateGradientColor(position) {
  const red = Math.round(255 - (position * 255) / 100);
  const blue = Math.round((position * 255) / 100);
  return `rgb(${blue}, 0, ${red})`;
}

// 섭씨를 켈빈과 화씨로 변환하는 함수
function convertCelsius(value, toUnit) {
  if (toUnit === 'kelvin') {
      return value + 273.15;
  } else if (toUnit === 'fahrenheit') {
      return (value * 9/5) + 32;
  }
  return value; // 기본은 섭씨로 유지
}

// function Element_Calculation(element_Temperature){
//     let element_mt = document.querySelector(`.element:nth-child(${i}) .element_melting`).textContent;
//     let element_bl = document.querySelector(`.element:nth-child(${i}) .element_boiling`).textContent;        
//     if(i == 2 || (i >= 104 && i <= 118)){ // 헬륨이거나, 미지 분류일 경우.
//         if(i == 2) {
//             if(element_Temperature >= element.element_bl){
//                 return ;
//             }
//         }
//     }else{
//         if(element_Temperature >= element.element_bl){ // 끓는 점이랑 같거나 높다면

//         }else if(element_Temperature > element.element_mt){ // 녹는 점보다 현재 온도가 높다면(녹기 시작)

//         }else if(element_Temperature < element.element_mt){ // 녹는 점보다 현재 온도가 낮다면
//         }
//     }
// }

function Look_Alignment(type, element_Temperature) {
    console.log(`Look Alignment -> type: ${type} | element_Temperature: ${element_Temperature}`);

    let elements = document.querySelectorAll('.periodic_table .element');

    elements.forEach(element => {
        let elementNum = element.querySelector('.element_num').textContent;

        if (elementNum.includes('-')) {
            // 일단 공백 유지(정공법은 tag lanthanide element 통해서 TAG 제거)
        } else {
            console.log(`Element Num: ${elementNum}`);
            
            let element_form = element.querySelector('.element_form');

            if (!element_form) {
                console.error(`.element_formd에서 elementNum에 대해 찾을 수 없음: ${elementNum}`);
                return;
            }

            // let element_form_content = element_form.textContent;
            let elementState = Element_Calculation(element_Temperature, element);

            console.log(`Form - ${element_form}, State - ${elementState}`);

            switch (type) {
                case 'Solid':
                    if (elementState === 'Solid') {
                        element.style.backgroundColor = 'green';
                    } else {
                        element.style.backgroundColor = 'yellow';
                    }
                    break;
                case 'Liquid':
                    if (elementState === 'Liquid') {
                        element.style.backgroundColor = 'green';
                    } else {
                        element.style.backgroundColor = 'yellow';
                    }
                    break;
                case 'Gas':
                    if (elementState === 'Gas') {
                        element.style.backgroundColor = 'green';
                    } else {
                        element.style.backgroundColor = 'yellow';
                    }
                    break;
                default:
                    if (elementState === 'Unknown') {
                        element.style.backgroundColor = 'green';
                    } else {
                        element.style.backgroundColor = 'yellow';
                    }
                    break;
            }
        }
    });
}



function Element_Calculation(element_Temperature, element) {
    if (!element) {
        console.error("Element_Calculation에 element 부여가 진행되지 않았습니다.");
        return 'Unknown';
    }

    let element_mt_text = element.querySelector(".element_melting").textContent;
    let element_bl_text = element.querySelector(".element_boiling").textContent;

    // "Unknown"인 경우를 처리
    if (element_mt_text === "Unknown" || element_bl_text === "Unknown") {
        console.info(`원소에 대한 녹는점 또는 끓는점을 알 수 없습니다`);
        return 'Unknown';
    }

    // 녹는 점 및 끓는 점을 숫자로 파싱
    let element_mt = parseFloat(element_mt_text);
    let element_bl = parseFloat(element_bl_text);

    // 디버깅을 위한 로그 출력
    console.log(`Element: Melting text - ${element_mt_text}, Boiling text - ${element_bl_text}`);
    console.log(`Element: Melting - ${element_mt}, Boiling - ${element_bl}, Temperature - ${element_Temperature}`);

    // 켈빈을 섭씨로 변환
    let element_Temperature_Celsius = element_Temperature - 273.15;

    // 녹는 점 및 끓는 점이 숫자가 아닌 경우 처리
    if (isNaN(element_mt) || isNaN(element_bl)) {
        console.error(`원소에 끓는(녹는)점이 잘못되었습니다: ${element_mt_text}, ${element_bl_text}`);
        return 'Unknown';
    }

    // 섭씨로 변환된 온도로 계산  // -273 >= -252
    if (element_Temperature_Celsius >= element_bl) {
        console.log(`El: Gas, ${element.className}`);
        return 'Gas';
    } else if (element_Temperature_Celsius >= element_mt) {
        console.log(`El: Liquid, ${element.className}`);
        return 'Liquid';
    } else {
        console.log(`El: Solid, ${element.className}`);
        return 'Solid';
    }
}


// function Look_Alignment(type) {
//     for (let i = 1; i <= 118; i++) {
//         let element = document.querySelector(`.element:nth-child(${i}`);
//         let element_form = document.querySelector(`.element:nth-child(${i}) .element_form`).textContent;
//         switch (type) {
//             case 'Solid':
//                 switch (element_form) {
//                     case 'Solid':
//                         element.style.backgroundColor = colorgreed;
//                         break;
//                     default:
//                         element.style.backgroundColor = coloryellow;
//                         break;
//                 }
//                 break;
//             case 'Liquid':
//                 switch (element_form) {
//                     case 'Liquid':
//                         element.style.backgroundColor = colorgreed;
//                         break;
//                     default:
//                         element.style.backgroundColor = coloryellow;
//                         break;
//                 }
//                 break;
//             case 'Gas':
//                 switch (element_form) {
//                     case 'Gas':
//                         element.style.backgroundColor = colorgreed;
//                         break;
//                     default:
//                         element.style.backgroundColor = coloryellow;
//                         break;
//                 }
//                 break;
//             default:
//                 switch (element_form) {
//                     case 'Unknown':
//                         element.style.backgroundColor = colorgreed;
//                         break;
//                     default:
//                         element.style.backgroundColor = coloryellow;
//                         break;
//                 }
//                 break;
//         }
//     }
// }
