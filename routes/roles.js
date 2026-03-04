var express = require('express');
var router = express.Router();
let { dataRole, dataUser } = require('../utils/data2');
let { genID } = require('../utils/idHandler');

// GET - Lấy tất cả roles
router.get('/', function (req, res, next) {
  let result = dataRole.filter(
    function (e) {
      return !e.isDeleted
    }
  )
  res.send(result);
});

// GET - Lấy role theo ID
router.get('/:id', function (req, res, next) {
  let id = req.params.id;
  let result = dataRole.filter(
    function (e) {
      return e.id == id && !e.isDeleted
    }
  )
  if (result.length) {
    res.send(result[0]);
  } else {
    res.status(404).send({
      message: "ID NOT FOUND"
    });
  }
});

// GET - Lấy tất cả users trong một role
router.get('/:id/users', function (req, res, next) {
  let id = req.params.id;
  let role = dataRole.filter(
    function (e) {
      return e.id == id && !e.isDeleted
    }
  )
  if (role.length) {
    let result = dataUser.filter(
      function (e) {
        return e.role.id == id && !e.isDeleted
      }
    )
    res.send(result);
  } else {
    res.status(404).send({
      message: "ROLE ID NOT FOUND"
    });
  }
});

// POST - Tạo role mới
router.post('/', function (req, res, next) {
  // Tìm ID lớn nhất hiện tại
  let maxId = 0;
  dataRole.forEach(function(role) {
    let idNum = parseInt(role.id.substring(1)); // Loại bỏ 'r' và chuyển thành số
    if (idNum > maxId) {
      maxId = idNum;
    }
  });
  
  let newRole = {
    id: "r" + (maxId + 1),
    name: req.body.name,
    description: req.body.description,
    creationAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  }
  dataRole.push(newRole);
  res.send(newRole);
});

// PUT - Cập nhật role theo ID
router.put('/:id', function (req, res, next) {
  let id = req.params.id;
  let result = dataRole.filter(
    function (e) {
      return e.id == id && !e.isDeleted
    }
  )
  if (result.length) {
    result = result[0];
    let keys = Object.keys(req.body);
    for (const key of keys) {
      if (result[key]) {
        result[key] = req.body[key];
        result.updatedAt = new Date(Date.now());
      }
    }
    res.send(result);
  } else {
    res.status(404).send({
      message: "ID NOT FOUND"
    });
  }
});

// DELETE - Xóa role theo ID (soft delete)
router.delete('/:id', function (req, res, next) {
  let id = req.params.id;
  let result = dataRole.filter(
    function (e) {
      return e.id == id && !e.isDeleted
    }
  )
  if (result.length) {
    result = result[0];
    result.isDeleted = true;
    result.updatedAt = new Date(Date.now());
    res.send(result);
  } else {
    res.status(404).send({
      message: "ID NOT FOUND"
    });
  }
});

module.exports = router;
