import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { Button, Form, Input } from 'antd';
import cn from 'classnames';
import { useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAsyncFn } from 'react-use';
import store from 'store2';

import { loginRequestType, loginService } from '@/services/user';
import { getParams, validEmail } from '@/utils/common';

import loginBg1 from '../../assets/loginBg1.png';
import loginBg2 from '../../assets/loginBg2.png';
import styles from './login.module.less';

interface loginProps {
  className?: string;
}

export function Login(props: loginProps) {
  const { className } = props;
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const [{ loading: loginLoading }, login] = useAsyncFn(
    async (params: loginRequestType) => {
      const data = await loginService(params);
      return data;
    }
  );

  const handleLogin = useCallback(() => {
    form
      .validateFields()
      .then(async (data: loginRequestType) => {
        const res = await login(data);
        store.set('authInfo', { ...res, signTime: new Date().getTime() });
        const redirectUri = getParams('redirectUri') || '/data-store';
        navigate(redirectUri);
      })
      .catch((e) => console.log('e', e));
  }, [form, login, navigate]);

  return (
    <div
      className={cn(styles.login, className, 'h-[100%] w-[100%] bg-[#F5F5F5]')}
    >
      <img className="absolute top-[100px] left-[20px]" src={loginBg2} />
      <img className="absolute bottom-[80px] right-0" src={loginBg1} />
      <div className="absolute left-0 top-0 flex h-[100%] w-[100%] flex-col items-center justify-center">
        <div className="text-[34px] font-[900] text-[#303133]">
          区块链安全威胁感知平台
        </div>
        <div className="mt-[10px] rounded-[8px] bg-[#FFFFFF] p-[30px] md:mt-[30px] md:p-[60px]">
          <Form form={form}>
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
                placeholder="邮箱"
                prefix={
                  <MailOutlined
                    style={{ color: '#30313380', fontSize: '18px' }}
                  />
                }
                size="large"
                className="!rounded !bg-[#FAFCFF] md:!min-w-[448px]"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: '请输入密码！' }]}
            >
              <Input.Password
                placeholder="密码"
                prefix={
                  <LockOutlined
                    style={{ color: '#30313380', fontSize: '18px' }}
                  />
                }
                size="large"
                className="!rounded !bg-[#FAFCFF] md:!min-w-[448px]"
              />
            </Form.Item>
            <div className="mt-[8px] text-[16px] text-[#166CDD]">
              暂无账号？
              <Link to="/register" className="underline">
                立即注册
              </Link>
            </div>
          </Form>

          <Button
            loading={loginLoading}
            type="primary"
            className="mt-[20px] mb-[10px] !h-auto w-[100%] !rounded-[4px] !bg-[#166CDD] !py-[8px] !text-[24px] md:mt-[60px] md:mb-[30px]"
            onClick={handleLogin}
          >
            登录
          </Button>
        </div>
      </div>
    </div>
  );
}
