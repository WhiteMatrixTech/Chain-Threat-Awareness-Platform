import { DoubleRightOutlined } from '@ant-design/icons';
import { Breadcrumb as AntBreadcrumb } from 'antd';
import cn from 'classnames';
import { useNavigate } from 'react-router';

interface BreadcrumbItem {
  menuHref: string;
  menuName: string;
  isLeftMenu?: boolean;
  withQueryParams?: boolean;
  state?: string;
}

interface BreadcrumbProps {
  breadCrumbItems: BreadcrumbItem[];
  className?: string;
}

export function AppBreadcrumb(props: BreadcrumbProps) {
  const { className, breadCrumbItems } = props;
  const navigate = useNavigate();

  const onClickBreadcrumb = (breadCrumbInfo: BreadcrumbItem) => {
    if (breadCrumbInfo.isLeftMenu) {
      navigate(breadCrumbInfo.menuHref);
    }
    if (breadCrumbInfo.withQueryParams) {
      navigate(breadCrumbInfo.menuHref, {
        state: breadCrumbInfo.state
      });
    }
  };

  return (
    <div className={cn('mb-6', className)}>
      <AntBreadcrumb separator={<DoubleRightOutlined />}>
        {breadCrumbItems.map((item, key) => {
          return key !== breadCrumbItems.length - 1 ? (
            <AntBreadcrumb.Item
              key={key}
              className="text-xl text-[#303133]"
              onClick={() => onClickBreadcrumb(item)}
            >
              {item.isLeftMenu || item.withQueryParams ? (
                <a href="/" onClick={(e) => e.preventDefault()}>
                  {item.menuName}
                </a>
              ) : (
                item.menuName
              )}
            </AntBreadcrumb.Item>
          ) : (
            <AntBreadcrumb.Item className="text-xl text-[#303133]" key={key}>
              {item.menuName}
            </AntBreadcrumb.Item>
          );
        })}
      </AntBreadcrumb>
    </div>
  );
}
