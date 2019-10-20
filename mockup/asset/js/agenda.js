let agd = {};
agd.title = "YCC 2019 | Day-1";
agd.workspace = {};
agd.workspace.name = "IT CAMP 2019";
agd.workspace.id = 369;
let slotTmp = [];
let slotNew = [];
let slotNew2 = [];
let slotLast = [];
let nowID = 2;
let slotArray = [];

var v_agd_title = new Vue({
	el: '#agd_title',
	data: {
		message: '___'
	}
})

var people = {
	"1234":{
		id:"1234",
		display:"Jabont",
		role:"Advisor",
		squad:["สันทนาการ","ที่ปรึกษา"],
		permission:{
			read:true,
			write:true
		}
	},
	"1235":{
		id:"1235",
		display:"New",
		role:"รองประธานค่าย",
		squad:["ประธานค่าย"],
		permission:{
			read:true,
			write:true
		}
	},
	"1236":{
		id:"1236",
		display:"Ong",
		role:"ประธานค่าย",
		squad:["ประธานค่าย"],
		permission:{
			read:true,
			write:true
		}
	},
};

var squad = {
	"สันทนาการ":{
		people:1,
		dur:0,
	},
	"ที่ปรึกษา":{
		people:1,
		dur:0,
	},
	"วิชาการ":{
		people:0,
		dur:0,
	},
	"ประสานงาน":{
		people:0,
		dur:0,
	},
	"สถานที่":{
		people:0,
		dur:0,
	},
	"สวัสดิการ":{
		people:0,
		dur:0,
	},
	"ประธานค่าย":{
		people:2,
		dur:0,
	},
	"การ์ด":{
		people:0,
		dur:0,
	},
	"พยาบาล":{
		people:0,
		dur:0,
	},
	"ทะเบียน":{
		people:0,
		dur:0,
	},
	"พิธีการ":{
		people:0,
		dur:0,
	},
};

var duty = {
	"s1":0
}

slotNew[540] = {
	"id": "s0",
	"title": "พิธีเปิด",
	"dur": 60,
	"venue": "Audi",
	"minD": 540,
	"start": [
	9,
	0
	],
	"stop": [
	10,
	0
	]
}
slotNew[720] = {
	"id": "s1",
	"title": "พักกลางวัน",
	"dur": 60,
	"venue": "โรงอาหาร",
	"minD": 720,
	"start": [
	12,
	0
	],
	"stop": [
	13,
	0
	]
}

slotTmp = slotNew;


function rendAgendaInfo(){
	v_agd_title.message = agd.title;
}

function rendAgendaSlot(){
	let q = 1;
	agenda_body.innerHTML = '';
	for (let i in slotNew) {
		if (slotNew[i] != undefined) {
			let id = slotNew[i].id;
			let start = slotNew[i].start;
			let stop = slotNew[i].stop;
			let title = slotNew[i].title;
			let venue = slotNew[i].venue;
			let dur = slotNew[i].dur;
			let row = document.createElement('div');
			row.innerHTML = renderSlotItem(id,q,start,stop,title,venue,dur,i);
			agenda_body.appendChild(row);
			q++;
		}
	}
	expectMinD = -1;
}

function agd_addNew(){
	let startH = parseInt(agdNew_startTimeH.value);
	let startM = parseInt(agdNew_startTimeM.value);
	let title = agdNew_title.value;
	let dur = parseInt(agdNew_duration.value);
	let venue = agdNew_venue.value;
	agdNew_startTimeH.value = '00';
	agdNew_startTimeM.value = '00';
	agdNew_title.value = '';
	agdNew_duration.value = '60';
	agdNew_venue.value = '';	
	let id = "s"+nowID;
	nowID++;
	createSlotObj(id,title,startH,startM,dur,venue);
	return false;
}


function createSlotObj(id,title,startH,startM,dur,venue){
	
	let newSlot =  {
		id:id,
		title:title,
		dur:dur,
		venue:venue,
		minD:timeToMinD(startH,startM)
	}
	prepareSlotTmp(newSlot);
	console.log(newSlot);
}

function prepareSlotTmp(newSlot){
	slotNew = [];
	NextMinD = newSlot.minD+newSlot.dur;
	for(let i in slotTmp){
		if (i>=newSlot.minD) {
			//สลอตเก่าอยู่ข้างล่าง
			if (i<NextMinD) {
				slotNew[NextMinD] = slotTmp[i];
				slotNew[NextMinD].minD = NextMinD;
				slotNew[NextMinD].start = minDtoTime(NextMinD);
				slotNew[NextMinD].stop = minDtoTime(NextMinD+slotTmp[i].dur);
				NextMinD += slotTmp[i].dur;
				if (i == newSlot.minD) {
					slotTmp[i] = undefined;
				}
			}
			else{
				slotNew[i] = slotTmp[i];
				NextMinD = i+slotNew[i].dur;
			}
		}
	}
	belowMinD = newSlot.minD;
	for (let i = newSlot.minD; i >= 0; i--) {
		if (slotTmp[i] != undefined) {
			if (i+slotTmp[i].dur<=belowMinD) {
				slotNew[i] = slotTmp[i];
				belowMinD = slotTmp[i].minD;
			}
			else{
				belowMinD = belowMinD - slotTmp[i].dur;
				slotNew[belowMinD] = slotTmp[i];
				slotNew[belowMinD].minD = belowMinD;
				slotNew[belowMinD].start = minDtoTime(belowMinD);
				slotNew[belowMinD].stop = minDtoTime(belowMinD + slotTmp[i].dur);
			}
		}
	}
	slotNew[newSlot.minD] = newSlot;
	slotNew[newSlot.minD].start = minDtoTime(newSlot.minD);
	slotNew[newSlot.minD].stop = minDtoTime(newSlot.minD+newSlot.dur);
	rendAgendaSlot();
	slotTmp = slotNew;

}

function prepareSlotTmpOld(){
	slotNew = [];
	let NextMinD = 0;
	let isFirstSlot = 1;
	for (let i in slotTmp) {
		if (isFirstSlot) {
			slotNew[i] = slotTmp[i];
			isFirstSlot = 0;
			NextMinD = slotTmp[i].minD+slotTmp[i].dur;
		}else{
			slotNew[NextMinD] = slotTmp[i];
			slotNew[NextMinD].minD = NextMinD;
			NextMinD = NextMinD+slotTmp[i].dur;
		}
	}
	for (let i in slotNew) {
		let startTime = slotNew[i].minD;
		let stopTime = slotNew[i].minD+slotNew[i].dur;
		startTime = minDtoTime(startTime);
		stopTime = minDtoTime(stopTime);
		slotNew[i].start = {};
		slotNew[i].stop = {};
		slotNew[i].start.h = startTime[0];
		slotNew[i].start.m = startTime[1];
		slotNew[i].stop.h = stopTime[0];
		slotNew[i].stop.m = stopTime[1];
	}
	slotTmp = slotNew;
}

const timeToMinD = (h,m) => {return (h*60)+m}

const minDtoTime = minD => {
	let h = parseInt(minD/60);
	let m = minD%60;
	return [h,m];
}
let expectMinD = -1;
const renderSlotItem = (id,q,start,stop,title,venue,dur,minD) => {
	let txt = '';
	if (expectMinD != -1 && expectMinD != minD) {
		txt += `<sp class="bg-smoke" ondblclick="removeGap(${minD-expectMinD},${minD},this)"></sp>`;
	}
	txt += `
	<theboxes class="middle spacing-s -clip">
	<box col="1"><inner class="padding padding-vs-hzt t-center b7">
	${q}
	</inner></box>
	<box col="2"><inner class="padding padding-vs-hzt t-center b5 bg-grey-1">
	${(start[0]).pad()}:${(start[1]).pad()} - ${(stop[0]).pad()}:${(stop[1]).pad()}
	</inner></box>
	<box col="4"><inner class="padding padding-vs-hzt t-left b7">
	${id} ${title}
	</inner></box>
	<box col="3"><inner class="padding padding-vs-hzt t-left b5">
	${venue}
	</inner></box>
	<box col="1"><inner class="b7">
	<input class="padding-xs-hzt  input wide t-center no-bd" type="number" placeholder="D" required="" value="${dur}" step="5" min="0" slot-id="${minD}" onchange="changeDuration(this)">
	</inner></box>
	<box col="1"><inner class="padding padding-vs-hzt t-center b7">
	..
	</inner></box>
	</theboxes><sp class="px bg-grey-3"></sp>
	`;
	expectMinD = parseInt(dur) + parseInt(minD);
	return txt;
}

Number.prototype.pad = function(size) {
	var s = String(this);
	while (s.length < (size || 2)) {s = "0" + s;}
	return s;
}

const changeDuration = (x) => {
	newDuration = parseInt(x.value);
	minD = x.getAttribute('slot-id');
	if (newDuration == 0) {
		if (confirm('ต้องการลบ slot นี้หรือไม่')) {
			slotNew[minD] = undefined;
			rendAgendaSlot();
		}
		else{
			x.value = 5;
		}
	}
	else{
		slotTmp[minD].dur = newDuration;
		calSlotOnChangeDuration(minD);
	}
}

let calSlotOnChangeDuration = (newMinD) => {
	slotNew = [];
	NextMinD = 0;
	for(let i in slotTmp){
		if (i<=newMinD) {
			slotNew[i] = slotTmp[i];
			NextMinD = slotTmp[i].minD+slotTmp[i].dur;
			slotNew[i].stop = minDtoTime(NextMinD);
		}
		else{
			calSlotOnChangeBelow(i,NextMinD);
		}
	}
	slotTmp = slotNew;
	rendAgendaSlot();
	document.querySelector(`[slot-id="${newMinD}"]`).focus();
}

const calSlotOnChangeBelow = (i,NextMinD) =>{
	if (i >= NextMinD) {
		slotNew[i] = slotTmp[i];
		NextMinD = slotTmp[i].minD+slotTmp[i].dur;
	}
	else{
		slotNew[NextMinD] = slotTmp[i];
		slotNew[NextMinD].minD = NextMinD;
		slotNew[NextMinD].start = minDtoTime(NextMinD);
		slotNew[NextMinD].stop = minDtoTime(NextMinD+slotTmp[i].dur);
		NextMinD = NextMinD+slotTmp[i].dur;
	}
}

const removeGap = (dur,minD,x) =>{
	slotNew = [];
	for(let i in slotTmp){
		if (i<minD) {
			slotNew[i] = slotTmp[i];
		}else{
			newMinD = slotTmp[i].minD - dur;
			slotNew[newMinD] = slotTmp[i];
			slotNew[newMinD].minD = newMinD;
			slotNew[newMinD].start = minDtoTime(newMinD);
			slotNew[newMinD].stop = minDtoTime(newMinD + slotTmp[i].dur);
		}
	}
	slotTmp = slotNew;
	rendAgendaSlot();
}

rendAgendaInfo();
rendAgendaSlot();