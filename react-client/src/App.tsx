import React, { Component } from "react";
import "./App.css";
import { FormComponentProps } from "antd/lib/form";
import {
  Tabs,
  List,
  Input,
  Card,
  Form,
  Select,
  DatePicker,
  InputNumber,
  Button
} from "antd";
import { MyQuery } from "./MyQuery";
import gql from "graphql-tag";
import { ApolloConsumer, Mutation } from "react-apollo";
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const Search = Input.Search;
const RangePicker = DatePicker.RangePicker;

const GET_EMPS = gql`
  query emps($size: Int = 10, $page: Int = 1) {
    getEmployees(size: $size, page: $page) {
      current
      size
      total {
        total_pages
        counts
      }
      employees {
        emp_no
        first_name
        last_name
        birth_date
        hire_date
      }
    }
  }
`;

const GET_EMP = gql`
  query emp($emp_no: String!) {
    getEmployee(emp_no: $emp_no) {
      emp_no
      first_name
      last_name
      birth_date
      hire_date
    }
  }
`;

const ADD_EMP = gql`
  mutation create($emp: EmployeeInput!) {
    employee: addEmployee(employee: $emp) {
      emp_no
      first_name
      last_name
      hire_date
      birth_date
      titles {
        title
        from_date
        to_date
      }
      salaries {
        salary
        from_date
        to_date
      }
    }
  }
`;

class App extends Component<FormComponentProps, { emp?: any }> {
  state: { emp?: any } = {};

  handleSubmit = (e: any, mutation: any) => {
    e.preventDefault();

    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }

      const titles = [
        {
          title: fieldsValue.title,
          from_date: fieldsValue.title_date[0].format("YYYY-MM-DD"),
          to_date: fieldsValue.title_date[1].format("YYYY-MM-DD")
        }
      ];

      const salaries = [
        {
          salary: fieldsValue.salary,
          from_date: fieldsValue.salary_date[0].format("YYYY-MM-DD"),
          to_date: fieldsValue.salary_date[1].format("YYYY-MM-DD")
        }
      ];

      const {
        birth_date,
        hire_date,
        gender,
        first_name,
        last_name
      } = fieldsValue;
      const emp = {
        first_name,
        last_name,
        gender,
        birth_date: birth_date.format("YYYY-MM-DD"),
        hire_date: hire_date.format("YYYY-MM-DD"),
        titles,
        salaries
      };

      mutation({ variables: { emp } });
    });
  };

  renderCache = (client: any) => {
    const keys = Object.keys(client.cache.data.data).filter(key =>
      key.includes("getEmployee")
    );

    return (
      <>
        {keys.map((key, i) => {
          const emp = client.cache.data.data[key];
          return (
            <Card title={emp.emp_no} key={`cache-emp-${i}`}>
              <p>{`${emp.first_name} ${emp.last_name}`}</p>
              <p>{`birth: ${emp.birth_date}`}</p>
              <p>{`hire: ${emp.hire_date}`}</p>
            </Card>
          );
        })}
      </>
    );
  };
  render() {
    const { emp } = this.state;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 }
      }
    };
    return (
      <div className="App">
        <Tabs defaultActiveKey="2">
          <TabPane tab="list" key="1">
            <MyQuery query={GET_EMPS}>
              {({ data, fetchMore }: any) => {
                return (
                  <List
                    bordered
                    pagination={{
                      current: data.getEmployees.current,
                      pageSize: data.getEmployees.size,
                      total: data.getEmployees.total.counts,
                      onChange: page =>
                        fetchMore({
                          variables: {
                            page
                          },
                          updateQuery: (prev: any, { fetchMoreResult }: any) =>
                            fetchMoreResult
                        })
                    }}
                    dataSource={data.getEmployees.employees}
                    renderItem={(emp: any) => (
                      <List.Item>{`${emp.emp_no}: ${emp.first_name} ${
                        emp.last_name
                      } ${emp.birth_date}`}</List.Item>
                    )}
                  />
                );
              }}
            </MyQuery>
          </TabPane>
          <TabPane tab="search" key="2">
            <ApolloConsumer>
              {client => (
                <Search
                  placeholder="search by emp_no"
                  onSearch={async value => {
                    const { data } = await client.query({
                      query: GET_EMP,
                      variables: { emp_no: String(value) }
                    });
                    this.setState({ emp: data.getEmployee });
                  }}
                  style={{ width: 200 }}
                />
              )}
            </ApolloConsumer>
            {emp && (
              <Card title={emp.emp_no}>
                <p>{`${emp.first_name} ${emp.last_name}`}</p>
                <p>{`birth: ${emp.birth_date}`}</p>
                <p>{`hire: ${emp.hire_date}`}</p>
              </Card>
            )}
          </TabPane>
          <TabPane tab="input mutation" key="3">
            <Mutation mutation={ADD_EMP}>
              {(addEmp, { data }) => (
                <Form onSubmit={e => this.handleSubmit(e, addEmp)}>
                  <Form.Item label="first name" {...formItemLayout}>
                    {getFieldDecorator("first_name", {
                      rules: [
                        {
                          required: true
                        }
                      ]
                    })(<Input />)}
                  </Form.Item>
                  <Form.Item label="last name" {...formItemLayout}>
                    {getFieldDecorator("last_name", {
                      rules: [
                        {
                          required: true
                        }
                      ]
                    })(<Input />)}
                  </Form.Item>
                  <Form.Item label="gender" {...formItemLayout}>
                    {getFieldDecorator("gender", {
                      rules: [
                        {
                          required: true
                        }
                      ]
                    })(
                      <Select>
                        <Option value="m">男</Option>
                        <Option value="f">女</Option>
                      </Select>
                    )}
                  </Form.Item>
                  <Form.Item {...formItemLayout} label="birth">
                    {getFieldDecorator("birth_date", {
                      rules: [
                        {
                          type: "object",
                          required: true,
                          message: "Please select time!"
                        }
                      ]
                    })(<DatePicker format="YYYY-MM-DD" />)}
                  </Form.Item>
                  <Form.Item {...formItemLayout} label="birth">
                    {getFieldDecorator("hire_date", {
                      rules: [
                        {
                          type: "object",
                          required: true,
                          message: "Please select time!"
                        }
                      ]
                    })(<DatePicker format="YYYY-MM-DD" />)}
                  </Form.Item>
                  <Form.Item {...formItemLayout} label="salary">
                    {getFieldDecorator("salary", {
                      rules: [
                        {
                          required: true
                        }
                      ]
                    })(<InputNumber />)}
                  </Form.Item>
                  <Form.Item {...formItemLayout} label="salary_date">
                    {getFieldDecorator("salary_date", {
                      rules: [
                        {
                          type: "array",
                          required: true,
                          message: "Please select time!"
                        }
                      ]
                    })(<RangePicker />)}
                  </Form.Item>
                  <Form.Item {...formItemLayout} label="title">
                    {getFieldDecorator("title", {
                      rules: [
                        {
                          required: true
                        }
                      ]
                    })(<Input />)}
                  </Form.Item>
                  <Form.Item {...formItemLayout} label="title_date">
                    {getFieldDecorator("title_date", {
                      rules: [
                        {
                          type: "array",
                          required: true,
                          message: "Please select time!"
                        }
                      ]
                    })(<RangePicker />)}
                  </Form.Item>
                  <Button type="primary" htmlType="submit">
                    Submit
                  </Button>
                  {data && (
                    <Card title={data.employee.emp_no}>
                      <p>{`${data.employee.first_name} ${
                        data.employee.last_name
                      }`}</p>
                      <p>{`birth: ${data.employee.birth_date}`}</p>
                      <p>{`hire: ${data.employee.hire_date}`}</p>

                      <ul>
                        {data.employee.titles.map((t: any, ti: any) => (
                          <li key={`title-${ti}`}>
                            <p>{t.title}</p>
                            <p>{`${t.from_date} - ${t.to_date}`}</p>
                          </li>
                        ))}
                      </ul>
                      <ul>
                        {data.employee.salaries.map((s: any, si: any) => (
                          <li key={`salary-${si}`}>
                            <p>{s.salary}</p>
                            <p>{`${s.from_date} - ${s.to_date}`}</p>
                          </li>
                        ))}
                      </ul>
                    </Card>
                  )}
                </Form>
              )}
            </Mutation>
          </TabPane>
          <TabPane tab="cache" key="4">
            <ApolloConsumer>{this.renderCache}</ApolloConsumer>
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default Form.create()(App);
