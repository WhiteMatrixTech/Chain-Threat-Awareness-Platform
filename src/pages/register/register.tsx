import { Button, Form, Input, Result } from 'antd';
import cn from 'classnames';
import { useCallback, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAsyncFn, useWindowSize } from 'react-use';

import { registerRequestType, registerService } from '@/services/user';

import loginBg1 from '../../assets/loginBg1.png';
import loginBg2 from '../../assets/loginBg2.png';
import styles from './register.module.less';

interface registerProps {
  className?: string;
}

interface registerFormData {
  code?: string;
  confirmPassword: string;
  contactAddress: string;
  contactEmail: string;
  contactName: string;
  institutionName: string;
  mobileNumber: string;
  password: string;
  userName: string;
}

export function Register(props: registerProps) {
  const { className } = props;
  const { height } = useWindowSize();
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const [isRegisterSuccess, setIsRegisterSuccess] = useState(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const [{ loading: registerLoading }, register] = useAsyncFn(
    async (params: registerRequestType) => {
      const data = await registerService(params);
      return data;
    }
  );

  const handleRegister = useCallback(() => {
    form
      .validateFields()
      .then(async (data: registerFormData) => {
        const {
          userName,
          password,
          contactAddress,
          contactEmail,
          contactName,
          institutionName,
          mobileNumber,
          code
        } = data;
        if (code) {
          await register({
            userId: contactEmail,
            password,
            metadata: {
              institutionName,
              contactName,
              contactAddress,
              userName,
              mobileNumber
            },
            code
          });
        } else {
          await register({
            userId: contactEmail,
            password,
            metadata: {
              institutionName,
              contactName,
              contactAddress,
              userName,
              mobileNumber
            }
          });
        }

        setIsRegisterSuccess(true);
      })
      .catch((error) => console.log('error', error));
  }, [form, register]);

  const validPassword = (
    value: string,
    fn: (error?: string | undefined) => void
  ) => {
    if (!value) {
      return fn('请输入确认密码！');
    }

    if (!password) {
      return fn('请先输入密码！');
    }

    if (value === password) {
      fn();
      return true;
    } else {
      fn('确认密码与密码不一致！');
    }
  };

  return (
    <div
      className={cn(
        styles.register,
        className,
        'h-[100%] w-[100%] bg-[#F5F5F5]'
      )}
    >
      <img className="absolute top-[100px] left-[20px]" src={loginBg2} />
      <img className="absolute bottom-[80px] right-0" src={loginBg1} />
      {!isRegisterSuccess && (
        <div
          className={cn(
            'absolute left-0 top-0 flex h-[100%] w-[100%] flex-col items-center ',
            height >= 900 ? ' justify-center' : ' my-[30px]'
          )}
        >
          <div className="text-[34px] font-[900] text-[#303133]">
            区块链安全威胁感知平台注册
          </div>
          <div className="mt-[10px] rounded-[8px] bg-[#FFFFFF] p-[30px] md:mt-[30px] md:p-[60px]">
            <Form form={form}>
              <Form.Item
                name="institutionName"
                rules={[{ required: true, message: '请输入机构名称!' }]}
              >
                <Input
                  placeholder="机构名称"
                  size="large"
                  className="!rounded !bg-[#FAFCFF] md:!min-w-[448px]"
                />
              </Form.Item>

              <Form.Item
                name="contactName"
                rules={[{ required: true, message: '请输入联系人姓名!' }]}
              >
                <Input
                  placeholder="联系人姓名"
                  size="large"
                  className="!rounded !bg-[#FAFCFF] md:!min-w-[448px]"
                />
              </Form.Item>

              <Form.Item
                name="contactAddress"
                rules={[{ required: true, message: '请输入联系人地址！' }]}
              >
                <Input
                  placeholder="联系地址"
                  size="large"
                  className="!rounded !bg-[#FAFCFF] md:!min-w-[448px]"
                />
              </Form.Item>

              <Form.Item
                name="mobileNumber"
                rules={[{ required: true, message: '请输入手机号!' }]}
              >
                <Input
                  placeholder="联系人手机号"
                  size="large"
                  className="!rounded !bg-[#FAFCFF] md:!min-w-[448px]"
                />
              </Form.Item>

              <Form.Item
                name="contactEmail"
                rules={[{ required: true, message: '请输入联系人邮箱!' }]}
              >
                <Input
                  value={email}
                  placeholder="联系人邮箱"
                  size="large"
                  onChange={(event) => setEmail(event.target.value)}
                  className="!rounded !bg-[#FAFCFF] md:!min-w-[448px]"
                />
              </Form.Item>

              <Form.Item
                name="userName"
                rules={[{ required: true, message: '请输入用户名!' }]}
              >
                <Input
                  placeholder="用户名"
                  size="large"
                  className="!rounded !bg-[#FAFCFF] md:!min-w-[448px]"
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[{ required: true, message: '请输入密码!' }]}
              >
                <Input
                  value={password}
                  placeholder="密码"
                  size="large"
                  onChange={(event) => setPassword(event.target.value)}
                  className="!rounded !bg-[#FAFCFF] md:!min-w-[448px]"
                />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                rules={[
                  {
                    validator: (rule, value: string, fn) => {
                      validPassword(value, fn);
                    }
                  }
                ]}
              >
                <Input
                  value={confirmPassword}
                  placeholder="确认密码"
                  size="large"
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  className="!rounded !bg-[#FAFCFF] md:!min-w-[448px]"
                />
              </Form.Item>

              <Form.Item name="code">
                <Input
                  placeholder="邀请码"
                  suffix={<div className="text-[#30313380]">*非必填</div>}
                  size="large"
                  className="!rounded !bg-[#FAFCFF] md:!min-w-[448px]"
                />
              </Form.Item>
            </Form>

            <Button
              loading={registerLoading}
              type="primary"
              className="mt-[20px] mb-[10px] !h-auto w-[100%] !rounded-[4px] !bg-[#166CDD] !py-[8px] !text-[24px] md:mt-[40px]"
              onClick={handleRegister}
            >
              注册
            </Button>

            <Link to="/login">
              <div className="bf-[#166CDD] text-center underline">
                使用已有账号登录
              </div>
            </Link>
          </div>
        </div>
      )}

      {isRegisterSuccess && (
        <div
          className={cn(
            'absolute left-0 top-0 flex h-[100%] w-[100%] flex-col items-center ',
            height >= 900 ? ' justify-center' : ' mt-[30px]'
          )}
        >
          <div className="flex h-[508px] w-[850px] items-center justify-center rounded-[8px] bg-[#ffffff] shadow-[#606F9433]">
            <Result
              status="success"
              title="您的账户：!"
              subTitle="注册成功"
              extra={[
                <Button
                  key="register"
                  onClick={() => setIsRegisterSuccess(false)}
                >
                  重新注册
                </Button>,
                <Button
                  type="primary"
                  key="login"
                  onClick={() => navigate('/login')}
                >
                  立即登录
                </Button>
              ]}
            />
          </div>
        </div>
      )}
    </div>
  );
}
