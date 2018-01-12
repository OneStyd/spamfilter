var express = require('express'),
    sequelize = require('./dbconnection'),
    sleep = require('system-sleep'),
    pyshell = require('python-shell');

var Matkul = require('./controllers/matakuliah.controller');

var mahasiswa = sequelize.import('./models/mahasiswa.model');
var historyMataKuliah = sequelize.import('./models/historyMataKuliah.model');
var matakuliah = sequelize.import('./models/mataKuliah.model');
var nilaiMutu = sequelize.import('./models/nilaiMutu.model');
var suggestion = sequelize.import('./models/suggestion.model');

mahasiswa.hasMany(historyMataKuliah, {foreignKey: 'fk_mahasiswa_id'});
historyMataKuliah.belongsTo(mahasiswa, {foreignKey: 'fk_mahasiswa_id', targetKey: 'id'});
matakuliah.hasMany(historyMataKuliah, {foreignKey: 'fk_mata_kuliah_id'});
historyMataKuliah.belongsTo(matakuliah, {foreignKey: 'fk_mata_kuliah_id', targetKey: 'id'});
nilaiMutu.hasMany(historyMataKuliah, {foreignKey: 'fk_nilai_mutu_id'});
historyMataKuliah.belongsTo(nilaiMutu, {foreignKey: 'fk_nilai_mutu_id', targetKey: 'id'});    

async function updateSuggestion(status, mhsInfo, matkulId, data = null){
    if(status){
        await suggestion.update({
            fk_nilai_mutu_id: data.prediksi_mutu,
            confidence: data.confidence,
            status: "PREDICTED"
        }, {
            where: {fk_mata_kuliah_id: matkulId, fk_mahasiswa_id: mhsInfo}
        })
        console.log("Suggestion Success");
    }else{
        await suggestion.update({
            status: "FAILED"
        }, {
            where: {fk_mata_kuliah_id: matkulId, fk_mahasiswa_id: mhsInfo}
        });
        console.log("Suggestion Failed "+data.message);
    }
}

async function predict(mhsInfo, matkulId, studyHour = 5){

    try{
        data = await Matkul.getPrasyarat(matkulId);

        if(!data.length){
            let message = "data prasayarat tidak ditemukan";
            updateSuggestion(false,mhsInfo,matkulId,{message:message});
            return null;
        }
        
        var listPrasyarat = new Array();
        var semester = data[0].mk.semester;
        var kodemk = data[0].mk.kode_mata_kuliah;

        for(var l in data){
            listPrasyarat[l] = data[l].smk.kode_mata_kuliah;
        }

        mhs = await mahasiswa.findOne({where: {id: mhsInfo}});
    
        matkul = await historyMataKuliah.findAll({
                    include: [{model: mahasiswa, attributes: ['nama_user', 'nama_mahasiswa', 'nim_mahasiswa']}, {model: matakuliah, attributes: ['kode_mata_kuliah', 'nama_mata_kuliah', 'semester']}, {model: nilaiMutu, attributes: ['huruf_mutu']}],
                    where: {fk_mahasiswa_id: mhs.id}
                });

        var mk = new Array();
        var mutu = {'E':0, 'D':1, 'C':2, 'BC':3, 'B':4, 'AB':5, 'A':6};
        var notFound = false;

        for(var l in listPrasyarat){
            let i = matkul.findIndex(x => x.mataKuliah.kode_mata_kuliah == listPrasyarat[l]);
            if(i !== -1){
                mk[l] = mutu[matkul[i].nilaiMutu.huruf_mutu];
            }else{
                let message = "nilai matkul prasayarat ("+listPrasyarat[l]+") tidak tersedia";
                updateSuggestion(false,mhsInfo,matkulId,{message:message});
                return null;
            }
        }

        let model = "smt"+semester+"_"+kodemk;
        let value = mk.join()+","+studyHour;

        let py_options = {
            scriptPath: __dirname+"/../predictor/",
            mode: 'json',
            args: ["-m", model, "-d", value]    
        };

        pyshell.run('pred_NN_coba.py', py_options, function(err, result){
            if(err){
                console.log("error occcured while running python programs")
            }else{
                let predicted = result[0];
                if(predicted.message.indexOf("No such model") !== -1){
                    let message = "model untuk matkul ("+kodemk+") tidak tersedia"; 
                    updateSuggestion(false,mhsInfo,matkulId,{message:message});
                }else{
                    mutu = {'A':1,'AB':2,'B':3,'BC':4,'C':5,'D':6,'E':7};
                    let prediksi_mutu = mutu[predicted.prediksi_mutu];
                    let confidence = predicted.probability[predicted.prediksi_mutu];

                    updateSuggestion(true,mhsInfo,matkulId,{prediksi_mutu:prediksi_mutu,confidence:confidence});
                }
            }  
        });
    }catch(err){
        return false;
    }
}

suggestion.sync();

while(1){
    var date = new Date();
    var target = new Date(date.getFullYear(),date.getMonth(),date.getDate(),11);
    suggestion.findAll({
        where: {$or: [
            {status: "SUBMITTED"},
            {updatedAt: {$lt: target}}
        ]}
    }).then(function(suggest){
        if(suggest.length){
            for(var s in suggest){
                var mhsId = suggest[s].fk_mahasiswa_id;
                var mkId = suggest[s].fk_mata_kuliah_id;

                predict(mhsId,mkId);
            }
        }
    });

    sleep(10000);
}