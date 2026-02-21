// 1️⃣ Who spends how much for food or appliances?
db.expenses.aggregate([
  { $match: { type: { $in: ["Food", "Appliances"] } } },
  {
    $lookup: {
      from: "emp",
      localField: "empno",
      foreignField: "empno",
      as: "employee"
    }
  },
  { $unwind: "$employee" },
  {
    $group: {
      _id: "$employee.ename",
      totalSpent: { $sum: "$payment" }
    }
  }
]);

// 2️⃣ Which department made the most purchases?
db.expenses.aggregate([
  {
    $lookup: {
      from: "emp",
      localField: "empno",
      foreignField: "empno",
      as: "employee"
    }
  },
  { $unwind: "$employee" },
  {
    $lookup: {
      from: "dept",
      localField: "employee.deptno",
      foreignField: "deptno",
      as: "department"
    }
  },
  { $unwind: "$department" },
  {
    $group: {
      _id: "$department.dname",
      total: { $sum: "$payment" }
    }
  },
  { $sort: { total: -1 } }
]);

// 3️⃣ Who spent the most?
db.expenses.aggregate([
  {
    $group: {
      _id: "$empno",
      total: { $sum: "$payment" }
    }
  },
  { $sort: { total: -1 } },
  { $limit: 1 }
]);
