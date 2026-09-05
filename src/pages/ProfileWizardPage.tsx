import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PRESET_PROFILES } from '../services/storageService';
import type { ExperienceLevel, DurationOption, TeamSizeOption, BudgetOption } from '../types/profile';
import { Sparkles, ArrowRight, ArrowLeft, Save, Plus, Check } from 'lucide-react';

const SUGGESTED_SKILLS = [
  'Python',
  'React',
  'TypeScript',
  'Node.js',
  'FastAPI',
  'PyTorch',
  'C++',
  'SQL',
  'Docker',
  'React Native',
  'HTML/CSS',
  'Git',
];

const SUGGESTED_INTERESTS = [
  'Education Tech',
  'Healthcare AI',
  'Sustainability',
  'Accessibility',
  'Campus Life',
  'FinTech',
  'Smart Agriculture',
  'Cybersecurity',
  'IoT & Hardware',
];

export const ProfileWizardPage: React.FC = () => {
  const { profile, updateProfileField, loadPresetProfile, generateIdeas, isGenerating, showToast } = useApp();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep = (step: number): boolean => {
    const errs: Record<string, string> = {};
    if (step === 1) {
      if (!profile.degreeBranch.trim()) errs.degreeBranch = 'Please select or enter your degree/branch.';
      if (profile.skills.length === 0) errs.skills = 'Please enter at least two technical skills.';
      if (profile.interests.length === 0) errs.interests = 'Please enter at least one field of interest.';
    } else if (step === 2) {
      if (!profile.preferredDomain.trim()) errs.preferredDomain = 'Please select or enter your preferred domain.';
      if (profile.weeklyHours < 5 || profile.weeklyHours > 60) errs.weeklyHours = 'Weekly hours must be between 5 and 60.';
    } else if (step === 3) {
      if (!profile.careerGoal.trim()) errs.careerGoal = 'Please specify your target career goal.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 3) {
        setCurrentStep(currentStep + 1);
      } else {
        generateIdeas();
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSkillsChange = (text: string) => {
    const arr = text.split(',').map((s) => s.trim()).filter(Boolean);
    updateProfileField('skills', arr);
  };

  const toggleSuggestedSkill = (skill: string) => {
    const current = profile.skills;
    const exists = current.some((s) => s.toLowerCase() === skill.toLowerCase());
    let updated: string[];
    if (exists) {
      updated = current.filter((s) => s.toLowerCase() !== skill.toLowerCase());
    } else {
      updated = [...current, skill];
    }
    updateProfileField('skills', updated);
  };

  const handleInterestsChange = (text: string) => {
    const arr = text.split(',').map((s) => s.trim()).filter(Boolean);
    updateProfileField('interests', arr);
  };

  const toggleSuggestedInterest = (interest: string) => {
    const current = profile.interests;
    const exists = current.some((i) => i.toLowerCase() === interest.toLowerCase());
    let updated: string[];
    if (exists) {
      updated = current.filter((i) => i.toLowerCase() !== interest.toLowerCase());
    } else {
      updated = [...current, interest];
    }
    updateProfileField('interests', updated);
  };

  const handleTechStackChange = (text: string) => {
    const arr = text.split(',').map((s) => s.trim()).filter(Boolean);
    updateProfileField('preferredTechStack', arr);
  };

  return (
    <div className="container" style={{ maxWidth: '800px', padding: '2.5rem 1.5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <div>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#4F46E5', textTransform: 'uppercase' }}>
              Step {currentStep} of 3
            </span>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0F172A' }}>
              {currentStep === 1 && 'Academic Background & Skills'}
              {currentStep === 2 && 'Time Commitment & Resource Scope'}
              {currentStep === 3 && 'Career Intentions & Tech Stack'}
            </h1>
          </div>

          <button
            onClick={() => showToast('Profile draft saved to local storage!', 'success')}
            className="btn btn-secondary btn-sm"
          >
            <Save size={14} /> Draft Auto-Saved
          </button>
        </div>

        <div style={{ backgroundColor: '#E2E8F0', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
          <div
            style={{
              backgroundColor: '#4F46E5',
              height: '100%',
              width: `${(currentStep / 3) * 100}%`,
              transition: 'width 0.3s ease',
            }}
          />
        </div>
      </div>

      <div style={{ backgroundColor: '#EEF2FF', border: '1px solid #C7D2FE', borderRadius: '10px', padding: '1rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#3730A3' }}>
          Need a quick starting profile for testing?
        </span>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {PRESET_PROFILES.map((p) => (
            <button
              key={p.id}
              onClick={() => loadPresetProfile(p.id)}
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #A5B4FC',
                color: '#4338CA',
                fontSize: '0.8rem',
                padding: '0.3rem 0.65rem',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 500,
              }}
            >
              {p.name} ({p.role.split(' ')[0]})
            </button>
          ))}
        </div>
      </div>

      <div className="card" style={{ marginBottom: '2rem' }}>
        {currentStep === 1 && (
          <div>
            <div className="form-group">
              <label className="form-label" htmlFor="degreeBranchInput">Degree Program & Branch</label>
              <input
                id="degreeBranchInput"
                type="text"
                className="form-control"
                placeholder="e.g. B.Tech Computer Science & Engineering"
                value={profile.degreeBranch}
                onChange={(e) => updateProfileField('degreeBranch', e.target.value)}
              />
              {errors.degreeBranch && <p className="form-error">{errors.degreeBranch}</p>}
            </div>

            {/* Skills Input + Quick Select Tag Chips */}
            <div className="form-group">
              <label className="form-label" htmlFor="skillsInput">Current Technical Skills</label>
              <input
                id="skillsInput"
                type="text"
                className="form-control"
                placeholder="e.g. Python, React, TypeScript, FastAPI, PostgreSQL"
                value={profile.skills.join(', ')}
                onChange={(e) => handleSkillsChange(e.target.value)}
              />
              <p className="form-hint" style={{ marginBottom: '0.5rem' }}>Tap quick tags below or type custom skills separated by commas:</p>

              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {SUGGESTED_SKILLS.map((skill) => {
                  const selected = profile.skills.some((s) => s.toLowerCase() === skill.toLowerCase());
                  return (
                    <button
                      type="button"
                      key={skill}
                      onClick={() => toggleSuggestedSkill(skill)}
                      style={{
                        backgroundColor: selected ? '#EEF2FF' : '#F1F5F9',
                        border: `1px solid ${selected ? '#4F46E5' : '#CBD5E1'}`,
                        color: selected ? '#4F46E5' : '#475569',
                        fontSize: '0.8rem',
                        fontWeight: 500,
                        padding: '0.25rem 0.55rem',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                      }}
                    >
                      {selected ? <Check size={12} /> : <Plus size={12} />} {skill}
                    </button>
                  );
                })}
              </div>
              {errors.skills && <p className="form-error">{errors.skills}</p>}
            </div>

            {/* Interests Input + Quick Select Tag Chips */}
            <div className="form-group">
              <label className="form-label" htmlFor="interestsInput">Key Fields of Interest</label>
              <input
                id="interestsInput"
                type="text"
                className="form-control"
                placeholder="e.g. Education, Healthcare, Sustainability, FinTech"
                value={profile.interests.join(', ')}
                onChange={(e) => handleInterestsChange(e.target.value)}
              />
              <p className="form-hint" style={{ marginBottom: '0.5rem' }}>Tap quick tags below to toggle interests:</p>

              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {SUGGESTED_INTERESTS.map((interest) => {
                  const selected = profile.interests.some((i) => i.toLowerCase() === interest.toLowerCase());
                  return (
                    <button
                      type="button"
                      key={interest}
                      onClick={() => toggleSuggestedInterest(interest)}
                      style={{
                        backgroundColor: selected ? '#F0FDFA' : '#F1F5F9',
                        border: `1px solid ${selected ? '#0D9488' : '#CBD5E1'}`,
                        color: selected ? '#0D9488' : '#475569',
                        fontSize: '0.8rem',
                        fontWeight: 500,
                        padding: '0.25rem 0.55rem',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                      }}
                    >
                      {selected ? <Check size={12} /> : <Plus size={12} />} {interest}
                    </button>
                  );
                })}
              </div>
              {errors.interests && <p className="form-error">{errors.interests}</p>}
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div>
            <div className="form-group">
              <label className="form-label" htmlFor="domainSelect">Preferred Domain</label>
              <select
                id="domainSelect"
                className="form-select"
                value={profile.preferredDomain}
                onChange={(e) => updateProfileField('preferredDomain', e.target.value)}
              >
                <option value="Education Tech">Education Tech</option>
                <option value="Healthcare AI & Telemetry">Healthcare AI & Medical Telemetry</option>
                <option value="Sustainability & Green Tech">Sustainability & Green Tech</option>
                <option value="Smart Agriculture & Food Tech">Smart Agriculture & Food Tech</option>
                <option value="Accessibility & Assistive Tech">Accessibility & Assistive Tech</option>
                <option value="Campus Life & Smart Facilities">Campus Life & Smart Facilities</option>
                <option value="FinTech & Student Financial Health">FinTech & Student Financial Health</option>
                <option value="Small Business & Local Commerce">Small Business & Local Commerce</option>
              </select>
              {errors.preferredDomain && <p className="form-error">{errors.preferredDomain}</p>}
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="hoursInput">Weekly Available Hours</label>
                <input
                  id="hoursInput"
                  type="number"
                  min={5}
                  max={60}
                  className="form-control"
                  value={profile.weeklyHours}
                  onChange={(e) => updateProfileField('weeklyHours', parseInt(e.target.value) || 15)}
                />
                <p className="form-hint">Hours per week allocated for capstone engineering.</p>
                {errors.weeklyHours && <p className="form-error">{errors.weeklyHours}</p>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="durationSelect">Project Duration</label>
                <select
                  id="durationSelect"
                  className="form-select"
                  value={profile.duration}
                  onChange={(e) => updateProfileField('duration', e.target.value as DurationOption)}
                >
                  <option value="1-2 months">1–2 months (Short Sprint)</option>
                  <option value="3-4 months">3–4 months (Standard Semester)</option>
                  <option value="5-6 months">5–6 months (Full Academic Year)</option>
                </select>
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="teamSizeSelect">Team Size</label>
                <select
                  id="teamSizeSelect"
                  className="form-select"
                  value={profile.teamSize}
                  onChange={(e) => updateProfileField('teamSize', parseInt(e.target.value) as TeamSizeOption)}
                >
                  <option value={1}>1 Student (Solo Project)</option>
                  <option value={2}>2 Students (Duo)</option>
                  <option value={3}>3 Students (Trio)</option>
                  <option value={4}>4 Students (Full Team)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="budgetSelect">Project Budget</label>
                <select
                  id="budgetSelect"
                  className="form-select"
                  value={profile.budget}
                  onChange={(e) => updateProfileField('budget', e.target.value as BudgetOption)}
                >
                  <option value="Free/Zero">Free / Zero Cost (Open Source)</option>
                  <option value="< $50 / Low">&lt; $50 / Low Budget</option>
                  <option value="$50-$200 / Moderate">$50 - $200 / Moderate Hardware/Cloud</option>
                  <option value="> $200 / Flexible">&gt; $200 / Flexible Lab Grant</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Self-Assessed Experience Level</label>
              <div style={{ display: 'flex', gap: '1rem' }}>
                {(['beginner', 'intermediate', 'advanced'] as ExperienceLevel[]).map((lvl) => (
                  <label key={lvl} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', textTransform: 'capitalize' }}>
                    <input
                      type="radio"
                      name="expLevel"
                      checked={profile.experienceLevel === lvl}
                      onChange={() => updateProfileField('experienceLevel', lvl)}
                    />
                    {lvl}
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div>
            <div className="form-group">
              <label className="form-label" htmlFor="preferredTechInput">Preferred Tech Stack (Optional override)</label>
              <input
                id="preferredTechInput"
                type="text"
                className="form-control"
                placeholder="e.g. React, Python, FastAPI, PostgreSQL"
                value={profile.preferredTechStack.join(', ')}
                onChange={(e) => handleTechStackChange(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="careerGoalInput">Target Career Goal or Post-Graduation Path</label>
              <textarea
                id="careerGoalInput"
                className="form-textarea"
                rows={3}
                placeholder="e.g. ML Engineer at top tech company / Software Engineer specializing in fullstack web app development"
                value={profile.careerGoal}
                onChange={(e) => updateProfileField('careerGoal', e.target.value)}
              />
              {errors.careerGoal && <p className="form-error">{errors.careerGoal}</p>}
            </div>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          onClick={handleBack}
          disabled={currentStep === 1}
          className="btn btn-secondary"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <button
          onClick={handleNext}
          disabled={isGenerating}
          className="btn btn-primary"
        >
          {isGenerating ? (
            <span>Generating Project Ideas...</span>
          ) : currentStep === 3 ? (
            <>Generate Projects <Sparkles size={16} /></>
          ) : (
            <>Next Step <ArrowRight size={16} /></>
          )}
        </button>
      </div>
    </div>
  );
};
