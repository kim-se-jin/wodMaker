function setDefaultStartDate() {
    const startDateInput = document.getElementById('start-date');
    const today = new Date();
    const dayOfWeek = today.getDay();
    const nextMonday = new Date(today);
    nextMonday.setDate(today.getDate() + (8 - dayOfWeek) % 7); // 다음 주 월요일 계산
    startDateInput.valueAsDate = nextMonday;
}

let activeTextarea = null;
let dayCount = 0;

function saveData() {
    const startDateInput = document.getElementById('start-date').value;
    const data = {
        startDate: startDateInput,
        dayInputs: []
    };

    for (let i = 0; i < dayCount; i++) {
        const dayData = {
            strengthRound: document.getElementById(`strength-round-${i}`)?.value || '',
            strengthTime: document.getElementById(`strength-time-${i}`)?.value || '',
            strengthDetails: document.getElementById(`strength-${i}`)?.value || '',
            wodType: document.getElementById(`wod-type-${i}`)?.value || '',
            round: document.getElementById(`round-${i}`)?.value || '',
            timecap: document.getElementById(`timecap-${i}`)?.value || '',
            teamOf2: document.getElementById(`team-of-2-${i}`)?.checked || false,
            wod: document.getElementById(`wod-${i}`)?.value || '',
            a: document.getElementById(`a-${i}`)?.value || '-/-',
            b: document.getElementById(`b-${i}`)?.value || '-/-',
            c: document.getElementById(`c-${i}`)?.value || '-/-'
        };
        data.dayInputs.push(dayData);
    }

    localStorage.setItem('workoutData', JSON.stringify(data));
}

function loadSavedData() {
    const savedData = localStorage.getItem('workoutData');
    if (!savedData) return;

    const data = JSON.parse(savedData);
    document.getElementById('start-date').value = data.startDate;

    data.dayInputs.forEach((dayData, index) => {
        createDayInputs(['월', '화', '수', '목', '금'][index], formatDateString(index));
        document.getElementById(`strength-round-${index}`).value = dayData.strengthRound;
        document.getElementById(`strength-time-${index}`).value = dayData.strengthTime;
        document.getElementById(`strength-${index}`).value = dayData.strengthDetails;
        document.getElementById(`wod-type-${index}`).value = dayData.wodType;
        document.getElementById(`round-${index}`).value = dayData.round;
        document.getElementById(`timecap-${index}`).value = dayData.timecap;
        document.getElementById(`team-of-2-${index}`).checked = dayData.teamOf2;
        document.getElementById(`wod-${index}`).value = dayData.wod;
        document.getElementById(`a-${index}`).value = dayData.a;
        document.getElementById(`b-${index}`).value = dayData.b;
        document.getElementById(`c-${index}`).value = dayData.c;
    });

    dayCount = data.dayInputs.length;
}

function createDayInputs(day, dateString) {
    const dayInputsContainer = document.getElementById('day-inputs');
    const dayInput = document.createElement('div');
    dayInput.className = 'day-input';
    dayInput.id = `day-${dayCount}`;
    
    dayInput.innerHTML = `
        <button class="remove-day-button" onclick="removeDay(${dayCount})">X</button>
        <label for="labelStyle">${day} (${dateString})</label>
        <br><br>

        <div class="strength-container">
            <label for="bolderStyle">Strength</label>
            <br><br>
            
            <label>Round: </label>
            <input type="number" id="strength-round-${dayCount}" min="1" value="1">
            <label>Time:</label>
            <input type="number" id="strength-time-${dayCount}" min="1">
        </div>
        <label>Strength Details</label>
        <br>
        <textarea id="strength-${dayCount}" rows="2" cols="50" oninput="showSuggestions(this, 'strength-${dayCount}')"></textarea><br>
        <br>

        <label for="bolderStyle">WOD</label>
        <br><br>
        <div class="wod-container">
            <label>Type:</label>
            <select id="wod-type-${dayCount}">
                <option value="For Time">For Time</option>
                <option value="AMRAP">AMRAP</option>
                <option value="EMOM">EMOM</option>
            </select>
            <label>Round:</label>
            <input type="number" id="round-${dayCount}" min="1">
            <label>TimeCap:</label>
            <input type="number" id="timecap-${dayCount}" min="1">
            <label>Team Of 2:</label>
            <input type="checkbox" id="team-of-2-${dayCount}">
        </div>
        <label>WOD Details</label>
        <br>
        <textarea id="wod-${dayCount}" rows="2" cols="50" onfocus="activeTextarea = this" oninput="showSuggestions(this, 'wod-${dayCount}')"></textarea><br>
        <label>A:</label>
        <input type="text" id="a-${dayCount}"><br>
        <label>B:</label>
        <input type="text" id="b-${dayCount}"><br>
        <label>C:</label>
        <input type="text" id="c-${dayCount}" value="-,-"><br>
    `;
    
    dayInputsContainer.appendChild(dayInput);
    dayCount++;
}

function addDay() {
    const dayOfWeek = document.getElementById('day-of-week').value;
    const startDateInput = document.getElementById('start-date').value;
    if (!startDateInput) {
        alert("시작 날짜를 입력해주세요.");
        return;
    }

    const startDate = new Date(startDateInput);
    const dayOffset = ["월", "화", "수", "목", "금"].indexOf(dayOfWeek);
    const date = new Date(startDate);
    // date.setDate(startDate.getDate() + dayOffset);

    const dateString = date.toISOString().split('T')[0];
    createDayInputs(dayOfWeek, dateString);
    saveData();
}

function removeDay(dayId) {
    const dayInput = document.getElementById(`day-${dayId}`);
    dayInput.remove();
    saveData();
}

function generateWeek() {
    const startDateInput = document.getElementById('start-date').value;
    if (!startDateInput) {
        alert("시작 날짜를 입력해주세요.");
        return;
    }

    const startDate = new Date(startDateInput);
    const days = ["월", "화", "수", "목", "금"];

    if (startDate.getDay() != 1 ){
        const dayOfWeek = startDate.getDay();
        const differenceToMonday = (dayOfWeek === 0 ? 6 : dayOfWeek - 1);
        startDate.setDate(startDate.getDate() - differenceToMonday);
    }

    
    days.forEach((day, index) => {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + index);
        const dateString = date.toISOString().split('T')[0];
        createDayInputs(day, dateString);
    });

    saveData();
}

function showSuggestions(textarea, id) {
    const suggestionsBox = document.getElementById('suggestions-box');
    if (suggestionsBox) suggestionsBox.remove();
    
    const value = textarea.value.trim();
    if (!value) return;
    
    const words = value.split(' ');
    const lastWord = words[words.length - 1];
    
    const suggestions = getSuggestions(lastWord);
    if (suggestions.length === 0) return;

    const rect = textarea.getBoundingClientRect();
    const box = document.createElement('div');
    box.className = 'autocomplete-suggestions';
    box.id = 'suggestions-box';
    box.style.top = `${rect.bottom + window.scrollY}px`;
    box.style.left = `${rect.left}px`;

    suggestions.forEach(suggestion => {
        const div = document.createElement('div');
        div.textContent = suggestion;
        div.onclick = () => {
            textarea.value = textarea.value.slice(0, textarea.value.lastIndexOf(' ') + 1) + suggestion;
            box.remove();
        };
        box.appendChild(div);
    });

    document.body.appendChild(box);
}

function getSuggestions(lastWord) {
    const suggestionsList = [
        // 클린
        'Clean',
        'Power Clean',
        'Squat Clean',
        'Hang Power Clean', 
        'Hang Squat Clean',
        'Hang Clean and Jerk',
        'Clean complex',
        

        //스내치
        'Snatch',
        'Power Snatch',
        'Squat Snatch',
        'Hang Power Snatch', 
        'Hang Squat Snatch', 
        'Snatch Balance',
        'Snatch Pull',
        'Muscle snatch',
        'Snatch complex',
        'Snatch deadlift',

        // 바벨
        'Overhead Squats',
        'Thruster',
        'sumo deadlift high pull',

        // 스트렝스
        'Deadlift', 
        'Back Squat',
        'Front Squat',
        'Shoulder press',
        'Push press',
        'Jerk',
        'Behind neck push press',
        'Box front squat',



        // 덤벨
        'DB snatches',
        'DB hang snatches',
        'DB Clean and Jerk',
        'DB hang fClean and Jerk',
        'DB overhead squat',
        'DB goblet squat',
        'Devil press',


        // 짐네
        'Pull-up',
        'Chest to bar',
        'Muscle-up',
        'Ring Muscle up',
        'toes to bar',

        // 케틀벨
        'Russian KB swings',
        'KB swings',
        'KB Lunges',
        'KB hang snatch',
        'KB snatch',


        // 맨몸
        'push-up',
        'Hand release push up',
        'double-unders',
        'sit-up',
        'V-up',
        'pistol squat',
        'Shuttle run',

        // 머신
        'Row',
        'Bike',

        // 박스
        'Box jump',
        'Box jump over',
        'DB box step-up',

        //버피
        'burpee',
        'burpee to target',
        'burpee over the bar',
        'burpee over the row',
        'burpee over the dumbbell',


        // 벽 사용
        'Wall Ball Shot',
        'MB Push press',
        'Hand Stand Push up',
        'Rope climb',
        'Wall walk'

    ];


    return suggestionsList.filter(suggestion =>
        suggestion.toLowerCase().startsWith(lastWord.toLowerCase())
    );
}

function insertText(wodText, aText, bText) {
    if (!activeTextarea) {
        alert("WOD 입력 칸을 클릭한 후 버튼을 눌러주세요.");
        return;
    }

    const cursorPosition = activeTextarea.selectionStart;
    const textBefore = activeTextarea.value.substring(0, cursorPosition);
    const textAfter = activeTextarea.value.substring(cursorPosition, activeTextarea.value.length);

    activeTextarea.value = `${textBefore}${wodText}${textAfter}`;
    activeTextarea.focus();
    activeTextarea.selectionStart = cursorPosition + wodText.length;
    activeTextarea.selectionEnd = cursorPosition + wodText.length;

    const activeDay = activeTextarea.id.split('-')[1];

    const aField = document.getElementById(`a-${activeDay}`);
    const bField = document.getElementById(`b-${activeDay}`);

    aField.value = aField.value ? `${aField.value}, ${aText}` : aText;
    bField.value = bField.value ? `${bField.value}, ${bText}` : bText;
}

function generateAndCopySchedule() {
    const startDateInput = document.getElementById('start-date').value;
    if (!startDateInput) {
        alert("시작 날짜를 입력해주세요.");
        return;
    }
    
    const output = [];
    
    for (let i = 0; i < dayCount; i++) {
        const strengthRound = document.getElementById(`strength-round-${i}`)?.value || '';
        const strengthTime = document.getElementById(`strength-time-${i}`)?.value || '';
        const strengthDetails = document.getElementById(`strength-${i}`)?.value || '';
        const wodType = document.getElementById(`wod-type-${i}`)?.value || '';
        const round = document.getElementById(`round-${i}`)?.value || '';
        const timecap = document.getElementById(`timecap-${i}`)?.value || '';
        const teamOf2 = document.getElementById(`team-of-2-${i}`)?.checked ? "TEAM OF 2" : "";
        const wod = document.getElementById(`wod-${i}`)?.value || '';
        const a = document.getElementById(`a-${i}`)?.value || '-/-';
        const b = document.getElementById(`b-${i}`)?.value || '-/-';
        const c = document.getElementById(`c-${i}`)?.value || '-/-';

        const formattedDate = new Date(startDateInput);
        formattedDate.setDate(formattedDate.getDate() + i);
        const dateString = formattedDate.toISOString().split('T')[0].replace(/-/g, '');

        if (document.getElementById(`day-${i}`)) {
            output.push(`${dateString} ${['월', '화', '수', '목', '금'][i]}`);
            output.push('');
            if (strengthRound) output.push(`Strength\n${strengthRound}R(${strengthTime}:00/set)\n${strengthDetails}`);
            output.push('');
            if (wodType) {
                output.push(`WOD\n${wodType}`);
                if (round) output.push(`Round: ${round}`);
                if (teamOf2) output.push(`TEAM OF 2`);
                output.push(`\n${wod}`);
            }
            output.push('');
            if (a !== '-/-') output.push(`A: ${a}`);
            if (b !== '-/-') output.push(`B: ${b}`);
            if (c !== '-/-') output.push(`C: ${c}`);
            output.push('');
            if (timecap) output.push(`TC: ${timecap}min`);
            output.push('');
            output.push('—————————');
        }
    }

    const scheduleText = output.join('\n');
    document.getElementById('output').textContent = scheduleText;

    navigator.clipboard.writeText(scheduleText).then(() => {
        alert("일정이 클립보드에 복사되었습니다.");
    }).catch(err => {
        console.error("클립보드 복사 실패:", err);
    });
}

function toggleFloatingButtons() {
    const floatingButtons = document.querySelector('.floating-buttons');
    const toggleButton = document.querySelector('.toggle-floating-buttons');

    if (floatingButtons.style.display === 'none') {
        floatingButtons.style.display = 'block';
        toggleButton.textContent = '▶';
    } else {
        floatingButtons.style.display = 'none';
        toggleButton.textContent = '◀';
    }
}