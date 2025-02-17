export class QuestionDto {
  title?: string; // 标题

  desc?: string; // 描述

  isPublished?: boolean; // 是否发布

  js?: string; // 脚本

  css?: string; // 样式

  html?: string; // 内容

  isStar?: boolean; // 是否收藏

  isDelete?: boolean; // 是否删除

  componentList?: {
    fe_id: string; // 组件ID
    type: string; // 组件类型
    title: string; // 组件标题
    isHidden: boolean; // 是否隐藏
    isLocked: boolean; // 是否锁定
    props: object; // 组件属性
  }[];
}
