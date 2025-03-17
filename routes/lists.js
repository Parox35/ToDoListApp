const express = require('express');
const router = express.Router();
const List = require('../models/List');
const User = require('../models/User');

const { where } = require('sequelize');
const Task = require('../models/Task');

/*
|--------------------------------------------------------------------------
|                                 Listes                                  |
|--------------------------------------------------------------------------
*/

//  Récupérer toutes les listes
router.get('/', async (req, res) => {
    try {
        const user = await User.findOne({where:{ id: req.session.userId} });
        const lists = await user.getLists();
        res.render('accueil', { title: 'Listes', lists });
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Erreur lors de la récupération des listes');
    }
});

// Ajout d'une nouvelle liste
router.get('/new', (req, res) => {
    try{
        res.render('new_list', { title: 'Nouvelle liste' });
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Erreur lors de la récupération de la liste');
    }
});

router.post('/new', async (req, res) => {
    try {
        await List.create({ name: req.body.name });

        const user = await User.findOne({where:{ id: req.session.userId} });
        const list = await List.findOne({ where: { name: req.body.name } });

        await user.addList(list);

        res.redirect('/');
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Erreur lors de l\'ajout de la liste');
    }
});

// Modification du nom d'une liste
router.patch('/:id', async (req, res) => {
    try {
        await List.update({ name: req.body.name }, { where: { id: req.params.id } });
        res.redirect('/');
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Erreur lors de la modification de la liste');
    }
});

// Suppression d'une liste
router.delete('/:id/delete', async (req, res) => {
    try {
        await List.destroy({ where: { id: req.params.id } });
        res.render('accueil');
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Erreur lors de la suppression de la liste');
    }
});

// Ajout d'un utilisateur à une liste
router.post('/:id/add_users', async (req, res) => {
    try {
        await List.addUser(req.params.id, req.body.email);
        res.redirect(`/lists/${req.params.id}`);
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Erreur lors de l\'ajout de l\'utilisateur');
    }
});

/*
|--------------------------------------------------------------------------
|                                 Taches                                  |
|--------------------------------------------------------------------------
*/
// Récupérer une liste avec ses taches
router.get('/:id', async (req, res) => {
    try {
        const list = await List.findOne(({where: { id: req.params.id }}));
        res.render('list', { list, tasks: await list.getTasks() });
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Erreur lors de la récupération de la liste');
    }
});

// Ajout d'une tache à une liste
router.post('/:id/tasks', async (req, res) => {
    try {
        await Task.create({ name: req.body.name, listId: req.params.id });
        res.redirect(`/lists/${req.params.id}`);
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Erreur lors de l\'ajout de la tâche');
    }
});

// Modification d'une tache
router.patch('/:id/tasks/:taskId', async (req, res) => {
    try {
        await Task.update({ name: req.body.name }, { where: { id: req.params.taskId } });
        res.redirect(`/lists/${req.params.id}`);
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Erreur lors de la modification de la tâche');
    }
});

// Suppression d'une tache
router.delete('/:id/tasks/:taskId', async (req, res) => {
    try {
        await Task.destroy({ where: { id: req.params.taskId } });
        res.redirect(`/lists/${req.params.id}`);
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Erreur lors de la suppression de la tâche');
    }
});

//Tache complete
router.patch('/:id/tasks/:taskId/complete', async (req, res) => {
    try {
        await Task.update({ completed: true }, { where: { id: req.params.taskId } });
        res.redirect(`/lists/${req.params.id}`);
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Erreur lors de la modification de la tâche');
    }
});

//Tache incomplete
router.patch('/:id/tasks/:taskId/incomplete', async (req, res) => {
    try {
        await Task.update({ completed: false }, { where: { id: req.params.taskId } });
        res.redirect(`/lists/${req.params.id}`);
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Erreur lors de la modification de la tâche');
    }
});

module.exports = router;