const puppeteer = require('puppeteer')
var fs = require('fs');

async function getFightCount(){
    const URL = 'https://www.hockeyfights.com/teams'
	const browser = await puppeteer.launch()

	const page = await browser.newPage()
	await page.goto(URL)

    const teams=[]
    const teamNames=[]

    //Get links to the fights page for each team
    var data=await page.$$eval(".teams-box>ul>li>a", elements=> elements.map(item=>item.href))
    teams.push(...data)

    var data2=await page.$$eval(".teams-box>ul>li", elements=> elements.map(item=>item.textContent))
    teamNames.push(...data2)


 for(let j=0;j<teams.length;j++){
    let total="";
    var league=""
    const fights=[]
    const seasons=[]

    await page.goto(teams[j])

    data=await page.$$eval(".fight-totals", elements=> elements.map(item=>item.textContent))
    data2=await page.$$eval(".season", elements=> elements.map(item=>item.textContent))

    fights.push(...data)
    seasons.push(...data2)

    if(j<32){
        league="NHL"
    }
    else if(31<j && j<64){
        league="AHL"
    }
    else if(61<j && j<92){
        league="ECHL"
    }
    else if(91<j && j<114){
        league="WHL"
    }
    else if(113<j && j<132){
        league="QMJHL"
    }
    else if(131<j && j<152){
        league="OHL"
    }
    else if(151<j && j<163){
        league="SPHL"
    }
    else if(162<j && j<170){
        league="LNAH"
    }
    else if(169<j && j<186){
        league="USHL"
    }
    else if(185<j && j<196){
        league="EIHL"
    }
    else if(195<j && j<220){
        league="KHL"
    }
    else if(219<j && j<229){
        league="FHL"
    }
    else if(228<j && j<261){
        league="NAHL"
    }


    for(let i=1;i<fights.length;i++){
        total+=league+","+teamNames[j]+","+seasons[i]+", "+fights[i]+ '\n'
    }
    
    if(total!==""){
        teamNames[j]=total
    }
    //Includes teams with no fight data
    else{
        teamNames[j]=league+","+teamNames[j]+',NULL,NULL\n'
    }
    
    console.log(teamNames[j])
 }

    await fs.writeFileSync('hockeyfights.csv', teamNames.join(''));
    


}

getFightCount();
