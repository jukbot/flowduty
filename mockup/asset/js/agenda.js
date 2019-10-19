let agd = {};
agd.title = "IT CAMP 2019 | Day-1";
agd.workspace = {};
agd.workspace.name = "IT CAMP 2019";
agd.workspace.id = 369;
let slotTmp = [];
let slotNew = [];
let nowID = 0;
let slotArray = [];

var v_agd_title = new Vue({
	el: '#agd_title',
	data: {
		message: '___'
	}
})

rendAgendaInfo();

function rendAgendaInfo(){
	v_agd_title.message = agd.title;
}

function rendAgendaSlot(){
	let q = 1;
	agenda_body.innerHTML = '';
	for (let i in slotNew) {
		let id = slotNew[i].id;
		let start = slotNew[i].start;
		let stop = slotNew[i].stop;
		let title = slotNew[i].title;
		let venue = slotNew[i].venue;
		let dur = slotNew[i].dur;
		let row = document.createElement('div');
		row.innerHTML = renderSlotItem(id,q,start,stop,title,venue,dur);
		agenda_body.appendChild(row);
		q++;
	}
}

function agd_addNew(){
	let startH = parseInt(agdNew_startTimeH.value);
	let startM = parseInt(agdNew_startTimeM.value);
	let title = agdNew_title.value;
	let dur = parseInt(agdNew_duration.value);
	let venue = agdNew_venue.value;
	agdNew_startTimeH.value = '';
	agdNew_startTimeM.value = '00';
	agdNew_title.value = '';
	agdNew_duration.value = '60';
	agdNew_venue.value = '';
	createSlotObj(title,startH,startM,dur,venue);
	rendAgendaSlot();
	return false;
}


function createSlotObj(title,startH,startM,dur,venue){
	nowID++;
	let newSlot =  {
		id:"s"+nowID,
		title:title,
		dur:dur,
		venue:venue,
		minD:timeToMinD(startH,startM)
	}
	slotTmp[timeToMinD(startH,startM)] = newSlot;
	prepareSlotTmp();
}

function prepareSlotTmp(){
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
		// let hm = minDtoTime(slotNew[i].minD);
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

const renderSlotItem = (id,q,start,stop,title,venue,dur) => {
	let txt = `
	<theboxes class="top spacing-s -clip">
	<box col="1"><inner class="padding-s padding-vs-hzt t-center b7">
	${q}
	</inner></box>
	<box col="2"><inner class="padding-s padding-vs-hzt t-center b7">
	${start.h}:${start.m} - ${stop.h}:${stop.m}
	</inner></box>
	<box col="4"><inner class="padding-s padding-vs-hzt t-center b7">
	${title}
	</inner></box>
	<box col="1"><inner class="padding-s padding-vs-hzt t-center b7">
	${dur}
	</inner></box>
	<box col="3"><inner class="padding-s padding-vs-hzt t-center b7">
	${venue}
	</inner></box>
	<box col="1"><inner class="padding-s padding-vs-hzt t-center b7">
	..
	</inner></box>
	</theboxes><sp class="px bg-grey-2"></sp>
	`
	return txt;
}


class Slot{
	constructor(title,minD,duration){
		this.title = title;
		this.minD = minD;
		this.duration = duration;
		this.start = start();
	}
	start(){
		let h = parseInt(this.minD/60);
		let m = this.minD%60;
		return [h,m];
	}
	stop(){
		let md = this.minD+this.duration;
		let h = parseInt(md/60);
		let m = md%60;
		return [h,m];
	}
}