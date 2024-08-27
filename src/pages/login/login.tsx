/* eslint-disable prettier/prettier */
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { Image } from "@antv/g6-react-node";
import { Button, Form, Input, notification } from "antd";
import cn from "classnames";
import { useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAsyncFn } from "react-use";
import store from "store2";

import LogoBlock from "@/assets/logo_block.png";
import { loginRequestType, loginService } from "@/services/user";
import pattern from "@/styles/pattern";
import { getParams, validEmail } from "@/utils/common";

import styles from "./login.module.less";

interface loginProps {
  className?: string;
}

export function Login(props: loginProps) {
  const { className } = props;
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const [
    { loading: loginLoading },
    login
  ] = useAsyncFn(async (params: loginRequestType) => {
    const data = await loginService(params);
    if (data) {
      store.set("authInfo", { ...data, signTime: new Date().getTime() });
      notification.success({ message: "登陆成功！" });
      const redirectUri = getParams("redirectUri") || "/data-store";
      navigate(redirectUri);
    }

    return data;
  });

  const handleLogin = useCallback(
    () => {
      form
        .validateFields()
        .then(async (data: loginRequestType) => {
          await login(data);
        })
        .catch(e => console.log("e", e));
    },
    [form, login]
  );

  return (
    <div
      className={cn(
        className,
        `h-screen w-full overflow-hidden bg-[url('./assets/login_bgNew.png')] bg-cover bg-center `
      )}
    >
      <div className=" rounded-[8px] bg-[#FFFFFF] pt-[30px] p-[60px] w-[541px] h-[416px] absolute right-[calc(10%)] 3xl:right-[calc(20%)] top-[calc(50%_-_208px)] flex flex-col  ">
        <div
          className={`text-[34px] font-[900] text-[#303133] ${pattern.flexCenter} mb-[40px]`}
        >
          <div className="">
            <img className="mr-[8px]" src={LogoBlock} width={40} height={40} />
          </div>

          <span className="text-[#0B4CD4] text-[27px] font-[500]">
            区块链安全威胁感知平台
          </span>
        </div>
        <Form form={form}>
          <span className="text-[#666666] text-[14px]">邮箱</span>

          <Form.Item
            name="userId"
            rules={[
              {
                validator: (rule, value: string, fn) => {
                  validEmail(value, fn);
                }
              }
            ]}
          >
            <Input
              size="large"
              className="!border-t-0 !border-r-0 !border-l-0 !bg-[#ffffff] !h-[36px] !rounded-[0px] !border-[#00000080]"
              style={{ boxShadow: "0 0 0" }}
            />
          </Form.Item>
          <span className="text-[#666666] text-[14px]">密码</span>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "请输入密码！" }]}
          >
            <Input.Password
              size="large"
              className="!border-t-0 !border-r-0 !border-l-0 !bg-[#ffffff] !h-[36px] !rounded-[0px] !border-[#00000080] "
              style={{ boxShadow: "0 0 0" }}
            />
          </Form.Item>
        </Form>

        <Button
          loading={loginLoading}
          type="primary"
          className={`!h-[48px] !w-[100%] !rounded-[6px] !bg-[#166CDD] !text-[18px] ${pattern.flexCenter} bg-gradient-to-r from-[#020F1A] via-[#1F54BC] to-[#0A3BA1] bg-clip-text text-transparent`}
          onClick={handleLogin}
        >
          登录
        </Button>
        <div className="mt-[8px] text-[15px]  mx-auto">
          <span className="text-[#666666]">暂无账号？</span>
          <Link to="/register" className="underline text-[#0B4ACF]">
            立即注册
          </Link>
        </div>
      </div>
    </div>
  );
}
