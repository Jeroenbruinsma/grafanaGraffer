let jsonData = require('./targets.json'); // done dynamically by variables list 
const baseGraph = require('./BaseGraph.json');
const model = require('./model.json');
const allDataGraph = require("./allDataGraph.json")
const masterSequenceExplanation = require("./masterSequenceExplanation.json")
const stateInformation = require("./stateInfo.json")
const stateStatistics = require("./stateStatistics.json")
const fs = require('fs');
const variablesRamp = require("./variablesRamp.json")
const variablesTower = require("./variablesTower.json")
const variablesTowerShort = require("./variablesTowerShort.json")
const singleTarget = require("./singleTarget.json")

//test if we can add ramp in the name APS-ramp-indi....
const equipmentType = "tower"
const dashboardName = equipmentType === "ramp" ? 'Cavotec-Connect_Overview-APS-individual' : 'Cavotec-Connect_Overview-APS-tower-individual'
const dashboardUid = equipmentType === "ramp" ? 'ShunzG04z' : 'Lfrq12AVz'


const variables = equipmentType === "ramp" ? variablesRamp : variablesTowerShort
// const variables = equipmentType === "ramp" ? variablesRamp : variablesTower
const final = []
const addBaseGraph = equipmentType === "ramp" ? true : false
const addMasterSequenceExplanation = equipmentType === "ramp" ? true : false
const addStateInformation = equipmentType === "ramp" ? true : false
const addStateStatistics = equipmentType === "ramp" ? true : false
const dashboardId = equipmentType === "ramp" ? 55 : 57

const currentVersion = 8

// const deviceId = '62972ef2be8b58339f883150' // APS Beta Test Tower
const deviceId =  equipmentType === "ramp" ? '62972ecc6b32f063dc6ea431' : '62972ef2be8b58339f883150' 

if(addBaseGraph) final.push(allDataGraph)
if(addMasterSequenceExplanation) final.push(masterSequenceExplanation)
if(addStateInformation) final.push(stateInformation)
if(addStateStatistics) final.push(stateStatistics)

const createQuery = (tagName, deviceId) => {
    return `Select measure_value::double as \"${tagName}\"\r\n,time\r\nfrom \"APS-test\".\"ramp_test\" where \r\ndeviceId = '${deviceId}'\r\nAND measure_name = '${tagName}'\r\nAND $__timeFilter `
}

const targetsList = []
variables.forEach((v,i) => {
    const target = {...singleTarget}
    target.refId = v
    target.rawQuery = createQuery(v, deviceId)
    targetsList.push(target)
})


const customtargetList = []

// jsonData.forEach((t,i) => {  
targetsList.forEach((t,i) => {  
    // if(i >= 3) return
    // console.log("i",t)
    const graph = {...baseGraph}
    graph.targets = [t]
    graph.title = "" //i.toString()
    const gridPos = {...graph.gridPos}
    const row = ( Math.floor((i ) / 3 ) * 11) + 33
    const col =  ((i%3)*8)
    gridPos.h = 11 
    gridPos.x = col
    gridPos.y = row
    graph.gridPos = gridPos
    graph.id = 20 + i

    // console.log("hey ",graph)
    final.push(graph)
    customtargetList.push(t)
    // "gridPos": {
    //     "h": 11,
    //     "w": 8,
    //     "x": 0,
    //     "y": 32

})

const customAllDataGraph = {...baseGraph}
customAllDataGraph.targets = customtargetList
customAllDataGraph.title = "customAllDataGraph" 
customAllDataGraph.title = 210 // we need an id to be able to edit it, not tested

customAllDataGraph.gridPos = {
        "h": 11,
        "w": 16,
        "x": 0,
        "y": 88
}
final.push(customAllDataGraph)


model.id = dashboardId
model.panels = final
model.version = currentVersion
model.title = dashboardName
model.uid = dashboardUid
let data = JSON.stringify(model);
fs.writeFileSync('finalModel.json', data);


    