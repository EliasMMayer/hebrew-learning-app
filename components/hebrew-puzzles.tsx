"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shuffle } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Import JSON data
import verbsData from '@/data/verbs.json';
import pronounsData from '@/data/pronouns.json';
import patternsData from '@/data/patterns.json';

interface VerbSelectorProps {
  availableVerbs: Record<string, any>;
  selectedVerbs: string[];
  onChange: (verbs: string[]) => void;
}

const VerbSelector = ({ availableVerbs, selectedVerbs, onChange }: VerbSelectorProps) => {
  const availableVerbsList = Object.keys(availableVerbs).filter(
    verb => !selectedVerbs.includes(verb)
  );

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Select Verbs to Practice:</h3>
      {availableVerbsList.length > 0 && (
        <Select 
          onValueChange={(value) => onChange([...selectedVerbs, value])}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Add verbs to practice..." />
          </SelectTrigger>
          <SelectContent>
            {availableVerbsList.map((verb) => (
              <SelectItem key={verb} value={verb}>
                {verb}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      <div className="flex flex-wrap gap-2">
        {selectedVerbs.map(verb => (
          <Button
            key={verb}
            variant="outline"
            size="sm"
            onClick={() => {
              if (selectedVerbs.length > 1) {
                onChange(selectedVerbs.filter(v => v !== verb));
              }
            }}
            disabled={selectedVerbs.length <= 1}
          >
            {verb} {selectedVerbs.length > 1 ? "✕" : ""}
          </Button>
        ))}
      </div>
    </div>
  );
};

const HebrewPuzzles = () => {
  const [selectedVerbs, setSelectedVerbs] = useState([Object.keys(verbsData)[0]]);
  const [currentChallenge, setCurrentChallenge] = useState<{
    pattern: any;
    pronoun: string;
  } | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    if (selectedVerbs.length > 0) {
      getNextChallenge();
    }
  }, [selectedVerbs]);

  const generateSentencePatterns = (selectedVerbs: string[]) => {
    return patternsData.patterns.map(pattern => ({
      ...pattern,
      verb1: {
        verb: selectedVerbs.includes("want") ? "want" : selectedVerbs[0],
        objects: pattern.objects.verb1
      },
      verb2: {
        verb: selectedVerbs.includes("eat") ? "eat" : selectedVerbs[0],
        objects: pattern.objects.verb2
      }
    }));
  };

  const getNextChallenge = () => {
    const patterns = generateSentencePatterns(selectedVerbs);
    const pattern = patterns[Math.floor(Math.random() * patterns.length)];
    const pronoun = Object.keys(pronounsData)[Math.floor(Math.random() * Object.keys(pronounsData).length)];
    setCurrentChallenge({ pattern, pronoun });
    setShowAnswer(false);
  };

  const generateSentence = (showHebrew = false) => {
    if (!currentChallenge) return "";
    
    const { pattern, pronoun } = currentChallenge;
    const subject = showHebrew ? pronounsData[pronoun].hebrew : pronounsData[pronoun].english;
    
    let verb1, verb2, object;
    
    if (pattern.id === "present-past") {
      verb1 = showHebrew 
        ? verbsData[pattern.verb1.verb].hebrew.present[pronoun]
        : verbsData[pattern.verb1.verb].english.present[pronoun];
      verb2 = showHebrew
        ? verbsData[pattern.verb2.verb].hebrew.past[pronoun]
        : verbsData[pattern.verb2.verb].english.past[pronoun];
      object = pattern.objects.verb1[Math.floor(Math.random() * pattern.objects.verb1.length)];
    } else {
      verb1 = showHebrew
        ? verbsData[pattern.verb1.verb].hebrew.past[pronoun]
        : verbsData[pattern.verb1.verb].english.past[pronoun];
      verb2 = showHebrew
        ? verbsData[pattern.verb2.verb].hebrew.past[pronoun]
        : verbsData[pattern.verb2.verb].english.past[pronoun];
      object = pattern.objects.verb2[Math.floor(Math.random() * pattern.objects.verb2.length)];
    }

    return showHebrew 
      ? `${subject} ${verb1} ${pattern.id === "present-past" ? object : "עברית"} ${pattern.id === "present-past" ? "אבל אתמול" : "ו"}${verb2} ${pattern.id === "present-past" ? "פיצה" : object}`
      : `${subject} ${verb1} ${pattern.id === "present-past" ? object : "Hebrew"} ${pattern.id === "present-past" ? "but yesterday" : "and"} ${verb2} ${pattern.id === "present-past" ? "pizza" : object}`;
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <Card className="bg-white">
        <CardContent className="p-6 space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">Hebrew Puzzles</h1>
            <p className="text-gray-600">Practice Hebrew verbs in context</p>
          </div>

          <VerbSelector
            availableVerbs={verbsData}
            selectedVerbs={selectedVerbs}
            onChange={setSelectedVerbs}
          />
          
          {currentChallenge && (
            <>
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">
                  {generateSentence(false)}
                </h2>
              </div>

              <div className="space-y-4">
                <Button 
                  onClick={() => setShowAnswer(!showAnswer)}
                  className="w-full"
                >
                  {showAnswer ? 'Hide Answer' : 'Show Answer'}
                </Button>

                {showAnswer && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-right">
                      {generateSentence(true)}
                    </div>
                  </div>
                )}

                <Button 
                  onClick={getNextChallenge}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Shuffle className="w-4 h-4" />
                  Next Challenge
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default HebrewPuzzles;
