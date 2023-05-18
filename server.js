//wprowadzamy informacje nt. modulow ktore beda wykorzystywane w tym pliku
let express = require("express");
let bodydParser = require("body-parser");
let fs = require("fs")

//tworzenie sterowiska aplikacji
let app = express();

//definicja mechanizmow wykorzystywanych przez app
app.use(bodydParser.json());
app.use(bodydParser.urlencoded({extended: true}));

//uruchomienie silnika szablonow EJS
app.set("view engine", "ejs")

app.listen(8080)
console.log("Serwer został pomyslnie uruchomiony na porcie 127.0.0.1:8080")

zapisz=(dane)=>{
    fs.writeFile("blog.json", JSON.stringify(dane),"utf8", function(err){
        if(err==true){
            console.log("blad dodawania");

        }
        else{
            console.log("pomyslnie dodano");
        }
    })

}
odczyt=()=>{

let dane;
    try{
        let daneJSON = fs.readFileSync("blog.json");
        dane =JSON.parse(daneJSON);
    }
    catch(err){
        dane=[];
    }
    return dane;
}
app.get("/", function(req, res){
    res.render("index", {wpisy : odczyt()});
})
app.get("/dodaj", function(req, res){
    res.render("index2");
})
app.post("/dodaj", function(req, res){
    obj={
        tytul : req.body['tytul'],
        tresc : req.body['tresc'],
    }
    let tab= odczyt();
    tab.push(obj);
    zapisz(tab);
    
    res.redirect("/")
})
app.get("/edytuj/:id", function(req, res){
    let index=req.params.id;
    let tab=odczyt();
    // let obj= tab[index];

    res.render("edytuj", {wpis : tab[index], id: index});


})
app.post("/edytuj/:id", function(req, res){
    let index=req.params.id;
    let tab= odczyt();

    tab[index].tytul =req.body['tytul'],
    tab[index].tytul = req.body['tresc'],
    
    zapisz(tab);
    
    res.redirect("/");
})
app.get("/usun/:id", function(req, res){
    let index=req.params.id;
    let tab= odczyt();
    tab.splice(index,1)
    zapisz(tab);
    res.redirect("/");
})