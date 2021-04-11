// global variables
const dataPath = './data/cats.json';

const catRoutes = (app, fs) => {


	app.get('/cats/', (req, res) => {
		fs.readFile(dataPath, 'utf8', (err, data) => {
			if (err) {
        // throw err;
        res.send({error:err});return;
			}
			jsonObj = JSON.parse(data);
			let maincatAll = JSON.parse(JSON.stringify(jsonObj.maincat));

			let maincat1 = JSON.parse(JSON.stringify(jsonObj.maincat));
			let maincat2 = JSON.parse(JSON.stringify(jsonObj.maincat));

			let subcat1 =  JSON.parse(JSON.stringify(jsonObj.subcat1));
			let type = JSON.parse(JSON.stringify(jsonObj.type));


			for(let k in maincatAll){
				if(maincatAll[k].subcat1_ids.length<=0) continue;
				
				let subcat1_ids = maincatAll[k].subcat1_ids;
				for(let id of subcat1_ids){
					maincatAll[k].subcat1 = maincatAll[k].subcat1 || [];
					maincatAll[k].subcat1.push(subcat1[id]);
				}
				delete maincatAll[k].subcat1_ids;

			}
			for(let k in maincat1){
				if(maincat1[k].subcat1_ids.length<=0) continue;
				
				let subcat1_ids = maincat1[k].subcat1_ids;
				for(let id of subcat1_ids){
					if(subcat1[id].type_id==1){
						maincat1[k].subcat1 = maincat1[k].subcat1 || [];
						maincat1[k].subcat1.push(subcat1[id]);
					}
				}
				delete maincat1[k].subcat1_ids;

			}
			for(let k in maincat2){
				if(maincat2[k].subcat1_ids.length<=0) continue;
				
				let subcat1_ids = maincat2[k].subcat1_ids;
				for(let id of subcat1_ids){
					if(subcat1[id].type_id==2){
						maincat2[k].subcat1 = maincat2[k].subcat1 || [];
						maincat2[k].subcat1.push(subcat1[id]);
					}
				}
				delete maincat2[k].subcat1_ids;

			}

			let result = {
				"-1":maincatAll
			};
			result[-1].name= type[-1].name;
			result[type[1].id] = maincat1;
			result[type[1].id].name = "";
			result[type[1].id].name = type[1].name;

			result[type[2].id] = maincat2;
			result[type[2].id].name = "";
			result[type[2].id].name = type[2].name;


			res.send(result);return;
		});
	});



}

module.exports = catRoutes;