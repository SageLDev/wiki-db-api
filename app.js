const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const e = require("express");
const app = express();
require("dotenv").config();

app.set("view engine", "ejs");

app.use(express.urlencoded({
    extended: true
}));

app.use(express.static("public"));

mongoose.connect(process.env.DBCONNECT);

const articleSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Articles = new mongoose.model("Article", articleSchema);

app.route("/articles")
.get(function(req, res){
    Articles.find({}, function(err, foundArticles){
        if (err){
            res.send(err);
        } else {
            res.send(foundArticles);
        }
    });
})
.post(function(req, res){

    newArticle = new Articles({
        title: req.body.title,
        content: req.body.content
    });

    newArticle.save(function(err, result){
        if (err){
            res.send(err);
        } else {
            res.send("Successfully added the article.");
        }
    });
})
.delete(function(req, res){
    Articles.deleteMany(function(err){
        if (!err){
            res.send("Successfully deleted all articles.");
        } else {
            res.send(err);
        }
    })
})

app.route("/articles/:articletitle")
.get(function(req, res){
    Articles.findOne({title: req.params.articletitle}, function(err, foundArticle){
        if (!err){
            if(foundArticle){
                res.send(foundArticle);
            }
            else {
                res.send("We didn't found your requested article.");
            }
        } else {
            res.send(err);
        }
    });
})
.put(function(req, res){
    console.log(req.body);
    Articles.findOneAndReplace(
        {title: req.params.articletitle},
        {title: req.body.title, content: req.body.content},
        null,
        function(err, updatedArticle){
            if(!err){
                if(updatedArticle){
                    res.send("Successfully updated article.");
                } else {
                    res.send("We didn't find your requested article.");
                }
            } else {
                res.send(err);
            }
        }
    );
})
.patch(function(req, res){
    Articles.findOneAndUpdate(
        {title: req.params.articletitle},
        req.body, 
        null,
        function(err, updatedArticle){
            if(!err){
                if(updatedArticle){
                    res.send("Successfully updated article.");
                } else {
                    res.send("We didn't find your requested article.");
                }
            } else {
                res.send(err);
            }
        }
    );
})
.delete(function(req, res){
    Articles.findOneAndDelete(
        {title: req.params.articletitle},
        function(err, deletedItem){
            if(!err){
                if(deletedItem){
                    res.send("Successfully deleted article.");
                } else {
                    res.send("We didn't find your requested article.");
                }
            } else {
                res.send(err);
            }
        }
    );
});

app.listen(process.env.PORT || 3000, function() {
    console.log("Server started successfully");
  });

