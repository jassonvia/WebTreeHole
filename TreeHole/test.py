# 简单的学生类示例
class Student:
    def __init__(self, name, student_id): #构造函数
        self.name = name           # 属性
        self.student_id = student_id
        self._score = 0            # 受保护的属性
    
    def study(self, hours):        # 方法
        print(f"{self.name}学习了{hours}小时")
        return hours * 10  # 模拟学习效果


    def set_score(self, score):   # 设置分数
        if 0 <= score <= 100:
            self._score = score
        else:
            raise ValueError("分数必须在0到100之间")    

chenqiang = Student("陈强", "2023001")  # 创建学生对象
print(f"学生姓名: {chenqiang.name}, 学号: {chenqiang.student_id}")
chenqiang.set_score(85)  # 设置分数
chenqiang.study(5)  # 学习5小时

print(f"{chenqiang.name}的分数是{chenqiang._score}")
            
