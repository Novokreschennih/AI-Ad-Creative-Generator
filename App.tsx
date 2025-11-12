import React, { useState, useCallback } from 'react';
import { FormData, AdCreative, AdCreativeGoal, CreativeStyle, AIModel } from './types';
import { WIZARD_STEPS } from './constants';
import * as geminiService from './services/geminiService';
import Step1Goal from './components/Step1Goal';
import Step2Info from './components/Step2Info';
import Step3Style from './components/Step3Style';
import Step4Result from './components/Step4Result';
import PinValidation from './components/PinValidation';
import LandingPage from './components/LandingPage';

const App: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem('isAuthenticated') === 'true');
    const [showPinValidation, setShowPinValidation] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<FormData>({
        goal: null,
        productDescription: '',
        targetAudience: '',
        usp: [''],
        websiteUrl: '',
        keywords: '',
        creativeStyle: CreativeStyle.PROFESSIONAL,
        variantCount: 3,
        aiModel: AIModel.GEMINI_FLASH,
    });
    const [generatedCreatives, setGeneratedCreatives] = useState<AdCreative[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handlePinSuccess = () => {
        localStorage.setItem('isAuthenticated', 'true');
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('isAuthenticated');
        setIsAuthenticated(false);
        setShowPinValidation(false);
        handleRestart();
    };
    
    const handleRestart = () => {
        setCurrentStep(1);
        setFormData({
            goal: null,
            productDescription: '',
            targetAudience: '',
            usp: [''],
            websiteUrl: '',
            keywords: '',
            creativeStyle: CreativeStyle.PROFESSIONAL,
            variantCount: 3,
            aiModel: AIModel.GEMINI_FLASH,
        });
        setGeneratedCreatives(null);
        setError(null);
    };

    const updateFormData = (data: Partial<FormData>) => {
        setFormData(prev => ({ ...prev, ...data }));
    };

    const handleNextStep = () => setCurrentStep(prev => Math.min(prev + 1, WIZARD_STEPS.length));
    const handlePrevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));
    
    const handleSelectGoal = (goal: AdCreativeGoal) => {
        updateFormData({ goal });
        handleNextStep();
    };

    const handleGenerate = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setCurrentStep(4);
        try {
            const result = await geminiService.generateAdCreatives(formData);
            setGeneratedCreatives(result);
        } catch (e: any) {
            setError(e.message || "An unknown error occurred.");
            setGeneratedCreatives(null);
        } finally {
            setIsLoading(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formData]);

    const handleRefine = useCallback(async (prompt: string) => {
        if (!generatedCreatives) return;
        setIsLoading(true);
        setError(null);
        try {
            const result = await geminiService.refineAdCreatives(generatedCreatives, prompt, formData);
            setGeneratedCreatives(result);
        } catch (e: any) {
            setError(e.message || "An unknown error occurred while refining.");
        } finally {
            setIsLoading(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [generatedCreatives, formData]);

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return <Step1Goal onSelectGoal={handleSelectGoal} />;
            case 2:
                return <Step2Info formData={formData} onUpdate={updateFormData} onNext={handleNextStep} onBack={handlePrevStep} />;
            case 3:
                return <Step3Style formData={formData} onUpdate={updateFormData} onGenerate={handleGenerate} onBack={handlePrevStep} />;
            case 4:
                return <Step4Result formData={formData} generatedCreatives={generatedCreatives} isLoading={isLoading} error={error} onRefine={handleRefine} onRestart={handleRestart} />;
            default:
                return <div>Неизвестный шаг</div>;
        }
    };

    if (!isAuthenticated) {
        if (showPinValidation) {
            return <PinValidation onSuccess={handlePinSuccess} />;
        }
        return <LandingPage onStart={() => setShowPinValidation(true)} />;
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 lg:p-8">
            <header className="max-w-7xl mx-auto mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold">AI Ad Creative Generator</h1>
                    <p className="text-gray-400 text-sm sm:text-base">для Яндекс.Директ</p>
                </div>
                 <button onClick={handleLogout} className="bg-gray-700 hover:bg-red-600 text-white text-xs sm:text-sm font-bold py-2 px-3 sm:px-4 rounded-lg transition duration-300">
                    Выйти
                </button>
            </header>
            
            <main className="max-w-7xl mx-auto">
                {currentStep < 4 && (
                    <ol className="flex items-center w-full max-w-2xl mx-auto text-sm font-medium text-center text-gray-500 dark:text-gray-400 sm:text-base mb-12">
                        {WIZARD_STEPS.map(step => (
                             <li key={step.id} className={`flex md:w-full items-center ${currentStep >= step.id ? 'text-indigo-600 dark:text-indigo-500' : ''} after:content-[''] after:w-full after:h-1 after:border-b ${currentStep > step.id ? 'after:border-indigo-600' : 'after:border-gray-700'} after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10`}>
                                <span className={`flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-500 ${currentStep >= step.id ? 'font-bold' : ''}`}>
                                    <span className={`mr-2 h-6 w-6 flex items-center justify-center rounded-full ${currentStep >= step.id ? 'bg-indigo-600 text-white' : 'bg-gray-700'}`}>{step.id}</span>
                                    {step.title}
                                </span>
                            </li>
                        ))}
                    </ol>
                )}
                <div className="bg-gray-800/50 rounded-lg p-4 sm:p-8 border border-gray-700/50 shadow-2xl">
                    {renderStep()}
                </div>
            </main>
        </div>
    );
};

export default App;
