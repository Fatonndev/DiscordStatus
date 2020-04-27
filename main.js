// Основные настройки
const updateTimeout          = 2000;       // Таймаут обновления статуса, счётчиков озу и цпу
const strTimeout             = 1800;       // Таймаут обновления бегущей строки
const timeout                = 7400;       // Таймаут смены режимов
const token                  = "";         // Токен
const string                 = "Здесь строка";

// Отключение и включение элементов
const FreeRamIncluded        = true;   // Показывает загрузку свободной RAM
const LoadAvgIncluded        = true;   // Показывает загрузку CPU
const RunningLineIncluded    = true;   // Показывает бегущую строку, заданную выше
const RunningLineX2Included  = true;   // Увеличивает продолжительность анимации для бегущей строки в 2р.
const TimeIncluded           = true;   // Показывает текущее время

// Загрузка модулей
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const winCpu = require("windows-cpu");
const os = require("os");

// Редактируйте только смайлы, текст в самом коде
var cpuAnimation = ["Загрузка ЦП: ", ""];  // Загрузка цп
var ramAnimation = ["Загрузка ОЗУ: ", ""]; // Загрузка озу
var timeAnimation = ["Время: ", ""];       // Время
var str          = string+" | ";           // Разделение между предложениями

// Переменные (ничего не трогать)
var isLoadAvg, isTime, isFreeRam, isRunningLine, loadAvg, freeRam, isRunningLineX2, date;

console.log("Подождите... Идет загрузка датчиков...")
// Главный апдейт
setInterval(async () => {

    if (isLoadAvg) {
        winCpu.totalLoad().then(load => {
            loadAvg = load + "%"
            cpuAnimation[0] = `Загрузка ЦП: ${loadAvg}`
            Discord.set(cpuAnimation);
        });
    }

    if (isFreeRam) {
        winCpu.totalMemoryUsage().then(mem => {
            freeRam = mem["usageInGb"].toFixed(2) + "GB из " + (os.totalmem() / 1024**3).toFixed(2) + "GB";
            ramAnimation[0] = `RAM занято: ${freeRam}`
            Discord.set(ramAnimation);
        });
    }

    if (isTime) {
        date = new Date();
        timeAnimation[0] = `Время: ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
        Discord.set(timeAnimation);
    }

}, updateTimeout);

// Анимация бегущей строки
setInterval(async () => {

    if (isRunningLine || isRunningLineX2) {
        var out = [];
        var last = 0;

        function runString() {
            runStr = str.split("");
            runStr.map((w, i) => {
                last = runStr.length - 1;
                if (i !== last) return;
                runStr.splice(i, i)
                runStr.unshift(w)
            })
            str = runStr.join("");
            return str;
        }

        str = runString();
        if(str.startsWith(' ')) str = runString();
        out = [str, ""]
        Discord.set(out);
    }

}, strTimeout);

// Смена статуса
setInterval(async () => {

    if (!isLoadAvg && !isFreeRam && !isRunningLine && !isRunningLineX2 && !isTime) {
        console.log("Программа запустилась");
        if(FreeRamIncluded) {
            isFreeRam = true;
        } else if(RunningLineIncluded){
            isRunningLine = true;
        } else if(TimeIncluded){
            isTime = true;
        } else if(LoadAvgIncluded){
            isLoadAvg = true;
        } else console.log("[ERROR]: Все типы выключены")
    }
    
    if (isFreeRam && FreeRamIncluded) {
        if(RunningLineIncluded) {
            isRunningLine=isRunningLineX2=isLoadAvg=isTime=isFreeRam = false;
            isRunningLine = true;
        } else if(TimeIncluded){
            isRunningLine=isRunningLineX2=isLoadAvg=isTime=isFreeRam = false;
            isTime = true;
        } else if(LoadAvgIncluded) {
            isRunningLine=isRunningLineX2=isLoadAvg=isTime=isFreeRam = false;
            isLoadAvg = true;
        } else console.log("[ERROR]: Все типы выключены");
        return;
    }
    
    if (isRunningLine && RunningLineIncluded) {
        if(RunningLineX2Included) {
            isRunningLine=isRunningLineX2=isLoadAvg=isTime=isFreeRam = false;
            isRunningLineX2 = true;
        } else if(TimeIncluded) {
            isRunningLine=isRunningLineX2=isLoadAvg=isTime=isFreeRam = false;
            isTime = true;
        } else if(LoadAvgIncluded) {
            isRunningLine=isRunningLineX2=isLoadAvg=isTime=isFreeRam = false;
            isLoadAvg = true;
        } else if(FreeRamIncluded) {
            isRunningLine=isRunningLineX2=isLoadAvg=isTime=isFreeRam = false;
            isFreeRam = true;
        } else console.log("[ERROR]: Все типы выключены");
        return;
    }
    
    if (isRunningLineX2 && RunningLineX2Included && RunningLineIncluded) {
        if(TimeIncluded){
            isRunningLine=isRunningLineX2=isLoadAvg=isTime=isFreeRam = false;
            isTime = true;
        } else if(LoadAvgIncluded) {
            isRunningLine=isRunningLineX2=isLoadAvg=isTime=isFreeRam = false;
            isLoadAvg = true;
        } else if(FreeRamIncluded) {
            isRunningLine=isRunningLineX2=isLoadAvg=isTime=isFreeRam = false;
            isFreeRam = true;
        } else if(RunningLineIncluded) {
            isRunningLine=isRunningLineX2=isLoadAvg=isTime=isFreeRam = false;
            isRunningLine = true
        } else console.log("[ERROR]: Все типы выключены");
        return;
    }

    if (isTime && TimeIncluded) {
        if(LoadAvgIncluded) {
            isRunningLine=isRunningLineX2=isLoadAvg=isTime=isFreeRam = false;
            isLoadAvg = true
        } else if(FreeRamIncluded) {
            isRunningLine=isRunningLineX2=isLoadAvg=isTime=isFreeRam = false;
            isFreeRam = true;
        } else if(RunningLineIncluded) {
            isRunningLine=isRunningLineX2=isLoadAvg=isTime=isFreeRam = false;
            isRunningLine = true
        } else console.log("[ERROR]: Все типы выключены");
        return;
    }
    
    if (isLoadAvg && LoadAvgIncluded) {
        if(FreeRamIncluded) {
            isRunningLine=isRunningLineX2=isLoadAvg=isTime=isFreeRam = false;
            isFreeRam = true;
        } else if(RunningLineIncluded) {
            isRunningLine=isRunningLineX2=isLoadAvg=isTime=isFreeRam = false;
            isRunningLine = true
        } else if(TimeIncluded) {
            isRunningLine=isRunningLineX2=isLoadAvg=isTime=isFreeRam = false;
            isTime = true
        } else console.log("[ERROR]: Все типы выключены");
        return;
    }

}, timeout);

// Все функции взаимодействия с Discord API
const Discord = {

    request: () => {
        let req = new XMLHttpRequest();
        req.open("PATCH", "https://discordapp.com/api/v6/users/@me/settings");
        req.setRequestHeader('authorization', token);
        req.setRequestHeader('Content-Type', "application/json");

        req.onload = function () {
            if(req.status != 200) console.log(`Error: ${req.status}`);
        };

        req.onerror = function () {
            console.log(`Network Error`);
        };

        return req;
    },

    set: (status) => {
        Discord.request().send('{"custom_status":{"text":"' + status[0] + '", "emoji_name": "' + status[1] + '"}}');
    },

    unset: () => {
        Discord.request().send('{"custom_status":null}');
    }
};

/* Скрипт написан KeviTV#9923 */