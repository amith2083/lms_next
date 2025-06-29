import { getLoggedInUser } from "@/lib/loggedInUser";
import { DocumentWithId, getSlug } from "@/lib/convertData";

import { IQuizsetRepository } from "@/app/interfaces/IQuizsetRepository";
import { IQuizsetService } from "@/app/interfaces/IQuizsetService";

import { Quizset } from "@/model/quizSet";
import { IQuizset } from "@/app/interfaces/IQuizset";


export class QuizsetService implements IQuizsetService {
  constructor(private quizsetRepository: IQuizsetRepository) {}

  async getQuizsets(excludeUnpublished: boolean): Promise<DocumentWithId[]> {
    return this.quizsetRepository.getQuizsets(excludeUnpublished);
  }

  async getQuizsetById(id: string): Promise<DocumentWithId | null> {
    return this.quizsetRepository.getQuizsetById(id);
  }

  async createQuizset(data: Partial<IQuizset>): Promise<DocumentWithId> {
    const loggedInUser = await getLoggedInUser();
    console.log('log',loggedInUser)
    if (!loggedInUser || loggedInUser.role !== "instructor") {
      throw new Error("Unauthorized: instructor access required");
    }
    const existing = await Quizset.findOne({ title: { $regex: `^${data.title}$`, $options: "i" } });
    if (existing) {
      throw new Error("A quizset with this title already exists");
    }
    const quizsetData = {
      ...data,
      slug: getSlug(data.title || ""),
      active: data.active ?? false,
    };
    console.log('quizsetdata',quizsetData)
    return this.quizsetRepository.createQuizset(quizsetData);
  }

  async updateQuizset(quizsetId: string, data: Partial<IQuizset>): Promise<DocumentWithId | null> {
    const loggedInUser = await getLoggedInUser();
    if (!loggedInUser || loggedInUser.role !== "instructor") {
      throw new Error("Unauthorized:instructor access required");
    }
    if (data.title) {
      const existing = await Quizset.findOne({
        title: { $regex: `^${data.title}$`, $options: "i" },
        _id: { $ne: quizsetId },
      });
      if (existing) {
        throw new Error("A quizset with this title already exists");
      }
    }
    return this.quizsetRepository.updateQuizset(quizsetId, data);
  }

  async addQuizToQuizset(quizsetId: string, quizData: any): Promise<void> {
    const loggedInUser = await getLoggedInUser();
    if (!loggedInUser || loggedInUser.role !== "instructor") {
      throw new Error("Unauthorized: instructor access required");
    }
    const transformedQuizData = {
  title: quizData.title,
  description: quizData.description,
  slug: getSlug(quizData.title || ""),
  options: (quizData.options || []).map((opt: { text: string; is_correct: boolean }) => ({
    text: opt.label,
    is_correct: opt.isTrue,
  })).filter(opt => opt.text), // Ensure no empty text
  mark: quizData.mark || 5,
  explanations: quizData.explanations,
};
    if (!transformedQuizData.options.some(opt => opt.is_correct)) {
      throw new Error("At least one option must be correct");
    }
    const quizId = await this.quizsetRepository.createQuiz(transformedQuizData);
    await this.quizsetRepository.addQuizToQuizset(quizsetId, quizId);
  }

  async deleteQuizFromQuizset(quizsetId: string, quizId: string): Promise<void> {
    const loggedInUser = await getLoggedInUser();
    if (!loggedInUser || loggedInUser.role !== "instructor") {
      throw new Error("Unauthorized: instructor access required");
    }
    return this.quizsetRepository.deleteQuizFromQuizset(quizsetId, quizId);
  }

  async changeQuizsetPublishState(quizsetId: string): Promise<boolean> {
    const loggedInUser = await getLoggedInUser();
    if (!loggedInUser || loggedInUser.role !== "instructor") {
      throw new Error("Unauthorized: instructor access required");
    }
    return this.quizsetRepository.changeQuizsetPublishState(quizsetId);
  }

  async deleteQuizset(quizsetId: string): Promise<void> {
    const loggedInUser = await getLoggedInUser();
    if (!loggedInUser || loggedInUser.role !== "instructor") {
      throw new Error("Unauthorized: instructor access required");
    }
    return this.quizsetRepository.deleteQuizset(quizsetId);
  }
}