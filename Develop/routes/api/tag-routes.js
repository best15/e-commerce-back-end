const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  try {
    const tagData = await Tag.findAll({
      include: [{ model: Product }],

    });
    res.status(200).json(tagData);
  } catch (error) {
    res.status(500).json(error);
  }

});

router.get('/:id', async (req, res) => {

  try {
    const tagData = await Tag.findByPk(req.params.id, {
      include: [{ model: Product }],

    });

    if (!tagData) {
      res.status(404).json({ message: 'No Tags found with that id!' });
      return;
    }

    res.status(200).json(tagData);
  } catch (error) {
    res.status(500).json(error);
  }

});

router.post('/', async (req, res) => {
  // create a new tag
  /* req.body should look like this...
      {
        tag_name: "sports",
        productIds: [1, 4]
      }
    */
  Tag.create(req.body)
    .then((tag) => {
      // if there's tag products, we need to create pairings to bulk create in the ProductTag model
      if (req.body.productIds.length) {
        const tagProductIdArr = req.body.productIds.map((product_id) => {
          return {
            tag_id: tag.id,
            product_id,
          };
        });
        console.log(tagProductIdArr);
        return ProductTag.bulkCreate(tagProductIdArr);
      }
      // if no tag products , just respond
      res.status(200).json(tag);
    })
    .then((tagProductIds) => res.status(200).json(tagProductIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });


});

router.put('/:id', async (req, res) => {
  // update a tag's name by its `id` value
  try {
    const tagData = await Tag.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    if (!tagData) {
      res.status(404).json({ message: 'No Tags with this id!' });
      return;
    }
    res.status(200).json(tagData);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.delete('/:id', async (req, res) => {
  // delete on tag by its `id` value
  try {
    const tagData = await Tag.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!tagData) {
      res.status(404).json({ message: 'No Tags found with that id!' });
      return;
    }

    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
