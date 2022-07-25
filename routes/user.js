const express = require('express');
const router = express.Router();
const multer = require('multer');
const User = require('../models/User');
const Book = require('../models/Book');


//define storage for the images
const storage = multer.diskStorage({
    //destination for files
    destination: function (request, file, cb) {
      cb(null, 'uploads');
    },
  
    //add back the extension
    filename: function (request, file, cb) {
      cb(null, Date.now() + file.originalname);
    },
  });

//upload parameters for multer
const upload = multer({storage: storage});

//USER
router.get('/user/homepage', function(req, res) {
    if(req.session.loggedin) {
        if(req.session.isUser)
        {
        console.log("data session dalam ni => ", req.session.email)
        Book.find({}).exec(function(err,buku){
            console.log(buku);
            res.render('User/index.ejs', {buku});   
        });
        }
        else {res.send('Sorry not authorized');}
    } 
    else {
        res.redirect('/login');
    }
});
router.get('/user/bookdetails/:id', function(req, res) {
    if(req.session.loggedin) {
        if(req.session.isUser)
        {
            Book.findOne({_id: req.params.id}, function(err,buku){
                User.findOne({email: buku.seller}, function(err,info)
                {
                 res.render('User/bookdetails.ejs', {buku,info});  
                });
                
            });
        } 
         else {res.send('Sorry not authorized');}
        }
        else {
            res.redirect('/login');
        }
});
router.get('/user/logout', function(req, res) {

    if(req.session.loggedin) {
        if(req.session.isUser)
        {
        req.session.destroy();
        res.redirect('/login');
        }
        else {res.send('Sorry not authorized');}
        }
    else {
         res.redirect('/login');
        }
});
router.get('/user/account', function(req, res) {

    if(req.session.loggedin) {
        if(req.session.isUser){
            email = req.session.email;
            User.findOne({email}, function(err,info){
            res.render('User/account.ejs', {info});    
            });
        }
    else {res.send('Sorry not authorized');}
    }
    else {
    res.redirect('/login');
    }
});
router.get('/user/editaccount', function(req, res) {

    if(req.session.loggedin) {
        if(req.session.isUser){
            email = req.session.email;
            User.findOne({email}, function(err,info){
            res.render('User/editaccount.ejs', {info});    
            });
        }
    else {res.send('Sorry not authorized');}
    }
    else {
    res.redirect('/login');
    }
});
router.post('/user/editaccount/:id', function(req, res) {
    if(req.session.loggedin) {
        if(req.session.isUser){
            User.findByIdAndUpdate(req.params.id, { $set: req.body},function (err, info) {
                if (err) {
                  console.log(err);
                }                  
                  console.log('User successfully updated =>', info);
                  res.redirect("/user/account");
                //res.redirect("/users/show/"+product._id);
              });
        }
    else {res.send('Sorry not authorized');}
    }
    else {
    res.redirect('/login');
    }
});

router.get("/user/allbook", (req, res) => { res.render("User/allbook.ejs");});
router.get('/user/addbook', function(req, res) {
    if(req.session.loggedin) {
        if(req.session.isUser)
        {
            if(req.session.contact !== null)
            {
             res.render("User/addbook.ejs");
            }
            else
            {
                res.redirect("/user/editaccount");
            }
        }
        else {res.send('Sorry not authorized');}
    } 
    else {
        res.redirect('/login');
    }
});
//route that handles new post
router.post('/user/addbook', upload.single('image'), async (req, res) => {
    if(req.session.loggedin) {
        if(req.session.isUser){
            this.title = req.body.title;
            this.price = req.body.price;
            this.category = req.body.category;
            this.description = req.body.description;
            this.image = req.file.filename;

            const newBook = new Book({
                title: this.title,
                image: this.image,
                price : this.price,
                category : this.category,
                description : this.description,
                status : 'Pending',
                seller : req.session.email
            });
            newBook.save();
            console.log('Book successfully registered =>', newBook);
        }
        else {res.send('Sorry not authorized');}
    }
    else {
    res.redirect('/login');
    }
});
router.get('/user/editaccount', function(req, res) {

    if(req.session.loggedin) {
        if(req.session.isUser){
            email = req.session.email;
            User.findOne({email}, function(err,info){
            res.render('User/editaccount.ejs', {info});    
            });
        }
    else {res.send('Sorry not authorized');}
    }
    else {
    res.redirect('/login');
    }
});
router.post('/user/editbook/:id',upload.single('image'), function(req, res) {
    if(req.session.loggedin) {
        if(req.session.isUser){
            Book.findByIdAndUpdate(req.params.id, {$set: req.body, image: req.file.filename},function (err, buku) {
                if (err) {
                  console.log(err);
                }                  
                  console.log('User successfully updated =>', buku);
                //res.redirect("/users/show/"+product._id);
              });
        }
    else {res.send('Sorry not authorized');}
    }
    else {
    res.redirect('/login');
    }
});
router.get('/user/editbook/:id', function(req, res) {
    if(req.session.loggedin) {
    if(req.session.isUser){
        Book.findOne({_id: req.params.id}).exec(function (err, buku) 
        {
        if (err) {
            console.log("Error:", err);
        }
        else {
            res.render("User/editbook.ejs", {buku});
        }
        });
    }
    else {res.send('Sorry not authorized');}
    }
    else {
        res.redirect('/login');
    }
});
router.get('/user/deletebook/:id', function(req, res) {
    if(req.session.loggedin) {
        if(req.session.isUser){
    Book.deleteOne({_id: req.params.id}, function(err) {
      if(err) {
        console.log(err);
      }
      else {
        console.log("Product deleted!");
        //res.redirect("/user/");
      }
    });
    } else {res.send('Sorry not authorized');}
    }
    else {
        res.redirect('/login');
    }
  });


module.exports = router;