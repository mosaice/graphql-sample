import Sequelize from 'sequelize';

export const sequelize = new Sequelize('employees', 'mosaice', '', {
  host: 'localhost',
  dialect: 'mysql',
  define: {
    timestamps: false
  }
});

const Employee = sequelize.define('employee', {
  emp_no: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  birth_date: Sequelize.DATE,
  first_name: Sequelize.STRING,
  last_name: Sequelize.STRING,
  gender: Sequelize.ENUM('M', 'F'),
  hire_date: Sequelize.DATE
});

export const Title = sequelize.define('title', {
  emp_no: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  title: Sequelize.STRING,
  from_date: Sequelize.DATE,
  to_date: Sequelize.DATE
});

export const Salary = sequelize.define('salary', {
  emp_no: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  salary: Sequelize.INTEGER,
  from_date: Sequelize.DATE,
  to_date: Sequelize.DATE
});

const Titles = Employee.hasMany(Title, {
  as: 'titles',
  foreignKey: {
    name: 'emp_no',
    allowNull: false
  }
});
const Salaries = Employee.hasMany(Salary, {
  as: 'salaries',
  foreignKey: {
    name: 'emp_no',
    allowNull: false
  }
});

export const EmployeeExtended = Object.assign(Employee, {
  Titles,
  Salaries
});
