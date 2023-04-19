const Recipe = require('../models/Recipe');
const User = require('../models/User');


const getRecipes = async (req, res) => {
    const {page} = req.query
    
    const LIMIT = 12
    const startIndex = (Number(page) - 1) * LIMIT;  // starting index of every page
    const total = await Recipe.countDocuments({})
    
    const recipes = await Recipe.find().lean().sort({createdAt: -1}).limit(LIMIT).skip(startIndex);

    if(!recipes?.length) return res.status(400).json({message: 'There are currently no recipes'});

    // ATTACHING A SPECIFIC USER TO A RECIPE THEY CREATED 
    const recipeWithUser = await Promise.all(recipes.map(async (recipe) => {
        const user = await User.findById(recipe.user).lean().exec();
        return {...recipe, username: `${user.firstName} ${user.lastName}`};
    }));

    // res.json(recipes)
    res.status(200).json({data: recipeWithUser, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT)});
};


const getUserRecipes = async (req, res) => {
    const {user} = req.params;
    if(!user) return res.status(400).json({message: 'Provide a user name'});

    const recipes = await Recipe.find({user});
    if(!recipes?.length) return res.status(400).json({message: `User doesn't have any recipes`});

    const owner = await User.findById(user);
    const fullName = `${owner.firstName} ${owner.lastName}`;

    res.status(200).json({recipes, fullName});
};


const createRecipe = async (req, res) => {
    const {user, name, ingridients, procedure, category, time, picturePath} = req.body;

    if(!user || !name || !ingridients || !procedure || !category || !time) {
        return res.status(400).json({message: 'Please provide all fields!'});
    }

    const recipe = await Recipe.create({
        user,
        name,
        ingridients,
        procedure,
        category,
        picturePath,
        time,
    });


    if(recipe) {
        return res.status(201).json({message: `Recipe for ${recipe.name} created succesfully.`});
    } else {
        return res.status(400).json({message: 'Invalid data received.'});
    }
};


async function getSingleRecipe(req, res) {
    const {id} = req.params;
    if(!id) return res.status(400).json({message: 'Provide recipe id'});

    const recipe = await Recipe.findById(id).exec();
    if(!recipe) return res.status(400).json({message: 'Recipe not found'});

    const user = await User.findById(recipe.user).lean().exec();
    const owner = `${user.firstName} ${user.lastName}`;

    res.status(200).json({recipe, owner});
}


const updatedRecipe = async (req, res) => {
    const {id, name, ingridients, procedure, category, time} = req.body;

    if(!id || !name || !ingridients || !procedure || !category || !time) {
        return res.status(400).json({message: 'Please provide all fields!'});
    }

    const recipe = await Recipe.findById(id).exec();
    if(!recipe) return res.status(400).json({message: 'Recipe not found!'});

    const duplicate = await Recipe.findOne({name}).collation({locale: 'en', strength: 2}).lean().exec();
    if(duplicate && duplicate?._id.toString() !== id)
        return res.status(409).json({message: 'Recipe already exist!'});

    recipe.name = name;
    recipe.ingridients = ingridients;
    recipe.procedure = procedure;
    recipe.category = category;
    recipe.time = time;

    const updatedRecipe = await recipe.save();

    res.status(201).json(updatedRecipe);
};


const deleteRecipe = async (req, res) => {
    const {id} = req.body;
    if(!id) return res.status(400).json({message: 'Recipe ID is required'});

    const recipe = await Recipe.findById(id);
    if(!recipe) return res.status(400).json({message: 'Recipe not found'});

    const deleted = recipe.deleteOne();
    const message = `Recipe for ${deleted.name} with ID: ${deleted._id}, has been deleted`;

    res.json(message);
};


module.exports = {
    getRecipes,
    getUserRecipes,
    createRecipe,
    updatedRecipe,
    deleteRecipe,
    getSingleRecipe
};