import { useNavigation } from '@react-navigation/native';
import React, { useState, useMemo } from 'react';
import {
    View,
    TextInput,
    FlatList,
    TouchableOpacity,
    Text,
    StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    horizontalScale,
    verticalScale,
    moderateScale,
    spacing,
    borderRadius
} from '../../utils/metrics';

const issues = [
    'Flat Tire',
    'New Tire',
    'New Tube',
    'Puncture Repair',
    'Wheel Alignment',
    'Balancing',
    'Valve Replacement',
    'Sidewall Damage',
    'Other',
];

const IssueSelection = () => {
    const [searchText, setSearchText] = useState('');
    const [selectedIssue, setSelectedIssue] = useState(null);
    const navigation = useNavigation();
    // Filter issues based on search text (case-insensitive)
    const filteredIssues = useMemo(() => {
        return issues.filter(issue =>
            issue.toLowerCase().includes(searchText.toLowerCase())
        );
    }, [searchText]);

    const handleSelect = (issue: string) => {
        // setSelectedIssue(issue);
        // if (onSelect) onSelect(issue);
    };
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Select an Issue</Text>
            <TextInput
                placeholder="Search issues"
                style={styles.searchInput}
                value={searchText}
                onChangeText={setSearchText}
                autoCorrect={false}
                autoCapitalize="none"
                clearButtonMode="while-editing"
                placeholderTextColor="#999"
            />
            <FlatList
                data={filteredIssues}
                keyExtractor={(item) => item}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ paddingBottom: 16 }}
                renderItem={({ item }) => {
                    const isSelected = item === selectedIssue;
                    return (
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={[styles.card, isSelected && styles.cardSelected]}
                            onPress={() => navigation.navigate("Appointment", { issue: item })}
                        >
                            <Text style={[styles.cardText, isSelected && styles.cardTextSelected]}>
                                {item}
                            </Text>
                        </TouchableOpacity>
                    );
                }}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No results found</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
};

export default IssueSelection;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFB',
    },
    title: {
        fontSize: moderateScale(24),
        fontWeight: '600',
        color: '#1A202C',
        marginHorizontal: spacing.m,
        marginTop: spacing.m,
        marginBottom: spacing.s,
    },
    searchInput: {
        height: verticalScale(48),
        borderRadius: borderRadius.m,
        backgroundColor: '#fff',
        marginHorizontal: spacing.m,
        fontSize: moderateScale(16),
        margin: spacing.m,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: moderateScale(10),
        shadowOffset: { width: 0, height: 1 },
        elevation: 2,
        paddingHorizontal: spacing.m,
    },
    card: {
        backgroundColor: '#fff',
        paddingVertical: spacing.m,
        paddingHorizontal: spacing.l,
        margin: spacing.m,
        marginVertical: spacing.s,
        borderRadius: borderRadius.l,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: moderateScale(10),
        shadowOffset: { width: 0, height: 3 },
        elevation: 4,
        justifyContent: 'center',
    },
    cardSelected: {
        backgroundColor: '#2979FF',
        shadowOpacity: 0.25,
        elevation: 6,
    },
    cardText: {
        fontSize: moderateScale(18),
        color: '#2D3748',
        fontWeight: '500',
    },
    cardTextSelected: {
        color: '#fff',
        fontWeight: '700',
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: verticalScale(60),
    },
    emptyText: {
        fontStyle: 'italic',
        color: '#A0AEC0',
        fontSize: moderateScale(16),
    },
});