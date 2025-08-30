import React, { useState, useMemo } from 'react';
import {
    SafeAreaView,
    View,
    TextInput,
    FlatList,
    TouchableOpacity,
    Text,
    StyleSheet,
} from 'react-native';
import {
    horizontalScale,
    verticalScale,
    moderateScale,
    fontScale,
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

const IssueSelection = ({ onSelect }) => {
    const [searchText, setSearchText] = useState('');
    const [selectedIssue, setSelectedIssue] = useState(null);

    // Filter issues based on search text (case-insensitive)
    const filteredIssues = useMemo(() => {
        return issues.filter(issue =>
            issue.toLowerCase().includes(searchText.toLowerCase())
        );
    }, [searchText]);

    const handleSelect = (issue) => {
        setSelectedIssue(issue);
        if (onSelect) onSelect(issue);
    };

    return (
        <SafeAreaView style={styles.container}>
            <TextInput
                placeholder="Search issues"
                style={styles.searchInput}
                value={searchText}
                onChangeText={setSearchText}
                autoCorrect={false}
                autoCapitalize="none"
                clearButtonMode="while-editing"
            />
            <FlatList
                data={filteredIssues}
                keyExtractor={(item) => item}
                keyboardShouldPersistTaps="handled"
                renderItem={({ item }) => {
                    const isSelected = item === selectedIssue;
                    return (
                        <TouchableOpacity
                            style={[styles.item, isSelected && styles.selectedItem]}
                            onPress={() => handleSelect(item)}
                        >
                            <Text style={[styles.itemText, isSelected && styles.selectedItemText]}>
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
        padding: spacing.m,
        backgroundColor: '#fff',
    },
    searchInput: {
        height: verticalScale(44),
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: borderRadius.m,
        paddingHorizontal: spacing.m,
        marginBottom: spacing.m,
        fontSize: fontScale(16),
    },
    item: {
        paddingVertical: verticalScale(14),
        paddingHorizontal: spacing.m,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    selectedItem: {
        backgroundColor: '#D0E8FF',
    },
    itemText: {
        fontSize: fontScale(16),
        color: '#333',
    },
    selectedItemText: {
        color: '#2962FF',
        fontWeight: '600',
    },
    emptyContainer: {
        paddingVertical: verticalScale(20),
        alignItems: 'center',
    },
    emptyText: {
        fontSize: fontScale(14),
        fontStyle: 'italic',
        color: '#999',
    },
});
