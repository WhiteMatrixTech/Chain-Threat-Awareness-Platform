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

  const loginV2 = () => {
    // const mockData = {
    //   accessToken:
    //     "eyJraWQiOiJhcm46YXdzOmttczphcC1ub3J0aGVhc3QtMTozMTYyNzQwNjE2OTc6YWxpYXNcL2FwcC1zZXJ2aWNlLWF1dGgtdjIiLCJhbGciOiJSU0FTU0FfUEtDUzFfVjFfNV9TSEFfMjU2In0.eyJhdWQiOiIxMTExMTFAcXEuY29tIiwibmJmIjoxNzI1NDMzMTA0LCJhcHBJZCI6IkNoYWluVGhyZWF0UGxhdGZvcm0iLCJpc3MiOiJDaGFpblRocmVhdFBsYXRmb3JtIiwiZXhwIjoxNzI1NDM0MzA0LCJzdHJhdGVneSI6IlVzZXJJZFBhc3N3b3JkIiwiaWF0IjoxNzI1NDMzMTA0LCJ1c2VySWQiOiIxMTExMTFAcXEuY29tIiwiYXV0aG9yaXRpZXMiOltdfQ.rdoEAovA3RG3_8ASZfxVoyjuMqAauKGEeGIeKAHOHAYsu8VVpTFl6_zdC-tRkK2r6_vA5ZWc_UjOUkF1wrRb4ywmIybI7m_AR9l7sTQFy2SDTY0cJKsNtromWYkpwBHY53es6q65_YLTNFe0U3cQ75VUn-GLLRx9vAKjzq2Rbv3sYYsK4USF0WmXHT72wKm0rFPTl6NrKsOAzuVIqNwawhPGZHRrmwDC0dHxYQeB1ZO9KE5ktFiggFqCik5kTVRR_9er8JoSAYt7pQC50PTpt24zOYPhOGCokPtdmgpb-UBg2UljTpjcJCns6lvs2F5vUb4ytxMvzmYpwMR85B4K9w",
    //   expiresIn: 1200,
    //   refreshToken:
    //     "eyJraWQiOiJhcm46YXdzOmttczphcC1ub3J0aGVhc3QtMTozMTYyNzQwNjE2OTc6YWxpYXNcL2FwcC1zZXJ2aWNlLWF1dGgtdjIiLCJhbGciOiJSU0FTU0FfUEtDUzFfVjFfNV9TSEFfMjU2In0.eyJhdWQiOiIxMTExMTFAcXEuY29tIiwibmJmIjoxNzI1NDMzMTA0LCJhcHBJZCI6IkNoYWluVGhyZWF0UGxhdGZvcm0iLCJpc3MiOiJDaGFpblRocmVhdFBsYXRmb3JtIiwiZXhwIjoxNzI1NTE5NTA0LCJzdHJhdGVneSI6IlVzZXJJZFBhc3N3b3JkIiwiaWF0IjoxNzI1NDMzMTA0LCJ1c2VySWQiOiIxMTExMTFAcXEuY29tIiwiYXV0aG9yaXRpZXMiOltdfQ.rkFKZ605gaAcn_h4K8Yg6YFPGmo1J03XX9tBsmdqCd6riTJW8JMNvS8FFZYUKsTMLQC12OYMjb-Ct4pvJhaScV7_W_rb9Kr8WWfEQS5TeJuJsvnIlC6LVoD0D8Ux9L_tf1TWUhg6ZT-MoLPRMGNLUSQVy6ayA5LlO2WLCcjHKAPGUiTpRic4U_kdkCBvmJbrXraNNw_HvofIj9bqapO9ya_9nWMp5riJILAdzGndbSvABUrNQ_lmtTuMiCaGXFAbTE1mXQrhPrWrI9EBQg0DwiVINynpvvz2r_PX0tq3TWSz7W-MCNS5Cr6EwptcnyA4uSSzrs9bULMONMHbuI0l7w",
    //   tokenType: "Bearer"
    // };
    setTimeout(() => {
      notification.success({ message: "登陆成功！" });
      const redirectUri = getParams("redirectUri") || "/data-store";
      navigate(redirectUri);
    }, 500);
  };

  const handleLogin = useCallback(
    () => {
      form
        .validateFields()
        .then((data: loginRequestType) => {
          // await login(data);
          loginV2();
        })
        .catch(e => console.log("e", e));
    },
    [form, login]
  );

  return (
    <div
      className={cn(
        className,
        `h-screen w-full overflow-hidden bg-[url('./assets/login_bgNew.png')] bg-cover bg-center fadeIn`
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
