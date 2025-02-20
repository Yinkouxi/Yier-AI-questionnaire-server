import { Injectable } from '@nestjs/common';
import { QuestionService } from 'src/question/question.service';
import { AnswerService } from 'src/answer/answer.service';

// 定义接口
interface RadioOption {
  value: string;
  text: string;
}

interface CheckboxOption {
  value: string;
  text: string;
}

interface Component {
  fe_id: string;
  type: string;
  props: {
    options?: RadioOption[];
    list?: CheckboxOption[];
  };
}

interface Question {
  componentList: Component[];
}

interface AnswerItem {
  componentFeId: string;
  value: string | string[];
}

@Injectable()
export class StatService {
  constructor(
    private readonly questionService: QuestionService,
    private readonly answerService: AnswerService,
  ) {}

  //获取单选框选项数据
  private _getRadioOptText(value: string, prop: { options?: RadioOption[] }) {
    const { options = [] } = prop;
    const length = options.length;

    for (let i = 0; i < length; i++) {
      const item = options[i];
      if (item.value === value) {
        return item.text;
      }
    }
    return '';
  }

  //获取多选框选项数据
  private _getCheckboxOptText(
    value: string,
    props: { list?: CheckboxOption[] },
  ) {
    const { list = [] } = props;
    const length = list.length;

    for (let i = 0; i < length; i++) {
      const item = list[i];
      if (item.value === value) {
        return item.text;
      }
    }
    return '';
  }

  // 生成答案信息
  private _generateAnswerInfo(question: Question, answerList: AnswerItem[]) {
    const res: Record<string, string | string[]> = {};
    const { componentList = [] } = question;

    answerList.forEach((a) => {
      const { componentFeId, value = [] } = a;

      // 获取组件信息
      const comp = componentList.find((c) => c.fe_id === componentFeId);
      if (!comp) return;

      const { type, props = { options: [], list: [] } } = comp;

      // 单选
      if (type === 'questionRadio') {
        res[componentFeId] = Array.isArray(value)
          ? value.map((v) => this._getRadioOptText(v, props).toString())
          : this._getRadioOptText(value, props).toString();
      } else if (type === 'questionCheckbox') {
        // 多选
        res[componentFeId] = Array.isArray(value)
          ? value.map((v) => this._getCheckboxOptText(v, props).toString())
          : this._getCheckboxOptText(value, props).toString();
      } else {
        res[componentFeId] = Array.isArray(value)
          ? value.join(',')
          : value.toString();
      }
    });

    return res;
  }

  // 获取单个问卷的答卷列表（分页）和数量
  async getQuestionStatListAndCount(
    questionId: string,
    opt: { page: number; pageSize: number },
  ) {
    const noData = { list: [], count: 0 };
    const { page = 1, pageSize = 10 } = opt;

    if (!questionId) {
      return noData;
    }

    const question = await this.questionService.findOne(questionId);
    if (!question) {
      return noData;
    }

    // question有值
    // 1 获取答卷数量
    const total = await this.answerService.countAnswers(questionId);
    if (total === 0) {
      return noData;
    }

    // 2 获取答卷列表
    const answers = await this.answerService.findAllAnswers(questionId, opt);
    // 3 获取答卷列表的答案信息
    const list = answers.map((a) => {
      return {
        id: a._id,
        ...this._generateAnswerInfo(question, a.answerList || []),
      };
    });

    return { list, total };
  }

  // 获取单个问卷中的组件的统计信息
  async getComponentStat(questionId: string, componentFeId: string) {
    if (!questionId || !componentFeId) return [];

    // 获取问卷
    const q = await this.questionService.findOne(questionId);
    if (q == null) return [];

    // 获取组件
    const { componentList = [] } = q;
    const comp = componentList.find((c) => c.fe_id === componentFeId);
    if (comp == null) return [];
    console.log(comp, 'comp');

    const { type, props } = comp;
    if (type !== 'questionRadio' && type !== 'questionCheckbox') {
      // 非单选和多选组件
      return [];
    }

    // 获取答卷信息
    const total = await this.answerService.countAnswers(questionId);
    if (total === 0) return [];
    const answers = await this.answerService.findAllAnswers(questionId, {
      page: 1,
      pageSize: total,
    });

    // 累加各个value的值
    const countInfo: Record<string, number> = {};
    answers.forEach((answer) => {
      const { answerList = [] } = answer;
      answerList.forEach((a) => {
        if (a.componentFeId !== componentFeId) return;

        // 确保 value 是数组
        const values = Array.isArray(a.value) ? a.value : [a.value];
        values.forEach((v) => {
          countInfo[v] = (countInfo[v] || 0) + 1;
        });
      });
    });

    // 整理数据
    const statList: Array<{ name: string; count: number }> = [];
    for (const val in countInfo) {
      let text = '';
      if (type === 'questionRadio') {
        text = this._getRadioOptText(val, props);
      } else if (type === 'questionCheckbox') {
        text = this._getCheckboxOptText(val, props);
      }
      statList.push({
        name: text,
        count: countInfo[val],
      });
    }
    return statList;
  }
}
