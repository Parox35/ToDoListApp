const express = require('express');
const router = express.Router();
const List = require('../models/List');
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
        const lists = await List.findAll(where({ userId: req.headers.id }));
        res.render('accueil.pug', { title: 'Listes', lists });
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Erreur lors de la récupération des listes');
    }
});

// Ajout d'une nouvelle liste
router.get('/new', (req, res) => {
    try{
        res.render('new_list.pug', { title: 'Nouvelle liste' });
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Erreur lors de la récupération de la liste');
    }
});

router.post('/new', async (req, res) => {
    try {
        await List.create({ name: req.body.name, userId: req.user.id });
        res.redirect('acceuil.pug');
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
        res.redirect('/lists');
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Erreur lors de la modification de la liste');
    }
});

// Suppression d'une liste
router.get('/:id/delete', async (req, res) => {
    try {
        await List.destroy({ where: { id: req.params.id } });
        res.render('/lists');
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
// Récupérer une liste avec ces taches
router.get('/:id', async (req, res) => {
    try {
        const list = await Task.findAll(where({ listId: req.params.id }));
        res.render('lists', { title: list.name, list });
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